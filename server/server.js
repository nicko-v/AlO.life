'use strict';

let express    = require('express');
let fs         = require('fs');
let helmet     = require('helmet');
let https      = require('https');
let multer     = require('multer');
let mysql      = require('mysql');
let onFinished = require('on-finished');
let onHeaders  = require('on-headers');
let path       = require('path');
let url        = require('url');
let log        = require('./log.js');

let app       = express();
let upload    = multer();
let limitList = new Set();

const PORT                = 8080;
const XHR_TIMEOUT         = 5000;
const MAX_LOG_FILE_SIZE   = 1e6; // bytes
const LOGS_CHECK_INTERVAL = 5; // hours
const HOSTNAME            = process.env.NODE_ENV === 'prod' ? 'alo.life' : `127.0.0.1:${PORT}`;
const USE_HTTPS           = process.env.NODE_ENV === 'prod';
const SECRET_JSON         = path.resolve(__dirname, './secret.json');
const LOGS_DIR            = path.resolve(__dirname, './logs');
const OLD_LOGS_DIR        = path.resolve(__dirname, './logs/old');
const ACCESS_LOG          = path.resolve(__dirname, './logs/access.log');
const STATIC_DIR          = path.resolve(__dirname, '../app/public');
const INDEX_HTML          = path.resolve(__dirname, '../app/public/index.html');
const SSL_CERT            = path.resolve(__dirname, '../../ssl_keys/fullchain.pem');
const SSL_KEY             = path.resolve(__dirname, '../../ssl_keys/privkey.pem');


fs.existsSync(LOGS_DIR)     || fs.mkdirSync(LOGS_DIR);
fs.existsSync(OLD_LOGS_DIR) || fs.mkdirSync(OLD_LOGS_DIR);
fs.existsSync(SECRET_JSON)  || createSecret(SECRET_JSON);

// Если интервал проверки необходимости ротации > 0, проверка проводится по интервалу, иначе - при каждом изменении файла:
if (LOGS_CHECK_INTERVAL) {
	setInterval(() => {
		let files = getFilesByType(LOGS_DIR, '.log');
		
		rotateFiles(files, MAX_LOG_FILE_SIZE, OLD_LOGS_DIR);
	}, LOGS_CHECK_INTERVAL * 3.6e6);
} else {
	fs.watch(LOGS_DIR, (eventType, fileName) => {
		let file = path.resolve(LOGS_DIR, fileName || '');
		
		if (path.extname(file) === '.log') { rotateFiles([file], MAX_LOG_FILE_SIZE, OLD_LOGS_DIR); }
	});
}


let secret = JSON.parse(fs.readFileSync(SECRET_JSON));
let pool   = mysql.createPool({
	connectionLimit: 100,
	host           : 'localhost',
	database       : secret.database,
	user           : secret.login,
	password       : secret.password
});


/**
	* @description Функция обращения к БД.
	* @param {String} query - Запрос. Значения могут быть заменены "?" и передаваться отдельно.
	* @param {Array} values - Значения, замененные в запросе "?", или пустой массив.
	* @param {Boolean} [allowEmptyResponse=false] - Обязательность возврата результата.
	* @returns {Promise}
*/
function db(query, values, allowEmptyResponse = false) {
	return new Promise( (resolve, reject) => {
		
		pool.getConnection( (error, connection) => {
			if (error) { reject('Error in connection to database.'); return; } // Ошибка при попытке создания соединения.
			
			connection.query(query, values, (error, rows) => {
				connection.release();
				
				// Ошибка запроса к БД:
				if (error) { reject(error.message); return; }
				// Данные в ответ не ожидаются:
				if (allowEmptyResponse) { resolve(); return; }
				// Данные ожидаются, но не найдены:
				if (!allowEmptyResponse && rows.length === 0) { reject(`No data found for query "${query}" [${values.join(', ')}]`); return; }
				
				/* Данные ожидаются и найдены: */
				// Ищется объект со строками, он может быть либо в корне массива-ответа, либо обернут в еще один массив:
				for (let i = 0; i < rows.length; i += 1) {
					if (rows[i].constructor.name === 'RowDataPacket') { resolve(rows); return; }
					if (Array.isArray(rows[i]) && rows[i].length && rows[i][0].constructor.name === 'RowDataPacket') { resolve(rows[i]); return; }
				}
				// Если объект со строками все же не найден:
				reject(`No data found for query "${query}" [${values.join(', ')}]`);
				/* -=-=-=- */
			});
		});
		
	});
}
/**
	* @description Функция проверки корректности ссылки для сокращения и ее ярлыка.
	               Для получения имени хоста в punycode используется модуль url.
	* @param {String} address - Полный URL, включающий протокол.
	* @param {String} alias - Ярлык для ссылки. Может быть пустой строкой.
	* @throws {WrongInput} Некорректная ссылка или ярлык.
*/
function validateInput(address, alias) {
	/* Изменяется вместе с аналогом на клиенте */
	const MAX_ADDRESS_LENGTH = 2000;
	const MIN_ADDRESS_LENGTH = 10;
	const MAX_ALIAS_LENGTH   = 50;
	const MIN_ALIAS_LENGTH   = 4;
	/* -=-=-=- */
	
	let addressRegexp = new RegExp('^([\\w\\-]+?\\.?)+?\\.[\\w\\-]+?$');
	let aliasRegexp   = new RegExp('(^$)|(^[-\\wА-Яа-яёЁ]+?$)');
	
	function WrongInput(where, message) {
		this.name = 'WrongInput';
		this.message = message;
		this.where = where;
	}
	function wordEnding(num) {
		return num.toString().search(/(11|12|13|14|0|[5-9])$/) > -1 ? 'ов' : num.toString().search(/1$/) > -1 ? '' : 'а';
	}
	
	
	if (address.length < MIN_ADDRESS_LENGTH) { throw new WrongInput('url', 'Некорректная ссылка.'); }
	if (address.length > MAX_ADDRESS_LENGTH) { throw new WrongInput('url', `Длина ссылки не должна превышать ${MAX_ADDRESS_LENGTH} символ${wordEnding(MAX_ADDRESS_LENGTH)}.`); }
	
	if (alias.length > MAX_ALIAS_LENGTH ||
	   (alias.length > 0 && alias.length < MIN_ALIAS_LENGTH)) { throw new WrongInput('alias', `Длина названия должна быть от ${MIN_ALIAS_LENGTH} до ${MAX_ALIAS_LENGTH} символ${wordEnding(MAX_ALIAS_LENGTH)}.`); }
	if (!aliasRegexp.test(alias))                             { throw new WrongInput('alias', 'Некорректное название. Допустимы символы A-z, А-я, 0-9, -, _'); }
	
	// Свойство hostname объекта url содержит имя хоста без протокола, порта и пути, кодированное в punycode, что упрощает проверку:
	let hname = url.parse(address).hostname;
	if (hname.length < 4 ||
	    hname.length > 255 ||
	    hname.toLowerCase().indexOf(HOSTNAME) > -1 ||
	    !addressRegexp.test(hname)) {
		throw new WrongInput('url', 'Некорректная ссылка.');
	}
}
/**
	* @description Функция получения из базы событий для хроники.
	* @param {(Boolean|NaN)} isNewestFirst - Отсортировать события по возрастанию давности.
	* @param {Object} res - Объект ответа сервера.
*/
function getEventsList(isNewestFirst, res) {
	db(`SELECT header, descr, icon, date FROM timeline_events ORDER BY date ${isNewestFirst ? 'DESC' : 'ASC'}`, []).then(
		resolve => { res.status(200).send(resolve); },
		reject  => { res.status(500).send(); log(reject, { type: 'error' }); }
	);
}
/**
	* @description Функция добавления новой пары "адрес-ярлык" в базу.
	               Если адрес некорректен, ярлык занят или некорректен - отсылает ошибку.
	               Если все нормально - отсылает получившийся URL.
	* @param {Object} query - Параметры и значения GET запроса к серверу.
	* @param {String} query.url - Ссылка для сокращения.
	* @param {String} query.alias - Ярлык для ссылки.
	* @param {Object} res - Объект ответа сервера.
*/
function shortenURL(query, res) {
	let address = decodeURIComponent(query.url);
	let alias   = query.alias.toLowerCase();
	
	if (address.search(/^(ftp|http|https):\/\//) === -1) { address = 'http://' + address; }
	
	try {
		validateInput(address, alias);
		if (alias.length) {
			db('CALL sp_addUrlWithUserAlias(?, ?)', [address, alias], true).then(
				resolve => { res.status(200).send(`http${USE_HTTPS ? 's' : ''}://${HOSTNAME}/${query.alias}`); },
				reject  => {
					if (reject.search(/duplicate entry/i) > -1) {
						res.status(400).send(`Сокращение "${query.alias}" уже занято.`);
					} else {
						res.status(400).send('Произошла непредвиденная ошибка.');
						log(reject, { type: 'error' });
					}
				}
			);
		} else {
			db('CALL sp_addUrlWithAutoAlias(?)', [address]).then(
				resolve => { res.status(200).send(`http${USE_HTTPS ? 's' : ''}://${HOSTNAME}/${resolve[0].aliasB36}`); },
				reject  => { res.status(400).send('Произошла непредвиденная ошибка.'); log(reject, { type: 'error' }); }
			);
		}
	} catch (error) {
		res.status(400).send(error.message); log(error.message, { type: 'error' });
	}
}
/**
	* @description Функция проверки наличия IP адреса в ограничительном списке.
	               Если адрес отсутствует - он вносится в список и добавляется таймаут на его удаление.
	* @param {String} userIP - IP адрес, с которого сделан запрос.
	* @returns {Boolean}
*/
function isRequestAllowed(userIP) {
	if (limitList.has(userIP)) {
		return false;
	} else {
		limitList.add(userIP);
		setTimeout( () => { limitList.delete(userIP); }, XHR_TIMEOUT );
		return true;
	}
}
/**
	* @description Функция создания файла secret.json со значениями-заглушками для дальнейшего их заполнения.
	* @param {String} path - Путь к файлу secret.json.
	* @returns {Object} Объект со значениями-заглушками.
*/
function createSecret(path) {
	let secret = { database: 'alolife', login: 'root', password: '123' };
	
	fs.appendFileSync(path, JSON.stringify(secret));
	log('No "secret.json" file found. A new one was just created. You must edit it by specifying correct credentials, then relaunch app.', { type: 'warn' });
	
	return true;
}
/**
	* @description Функция переносит содержимое файла в новый файл в указанной директории в случае,
	*              если размер файла превысил максимально допстимый, затем очищает исходный файл.
	* @param {Array} files - Массив строк, содержащих абсолютные пути к файлам, которые требуется ротировать.
	* @param {Number} maxSize - Максимальный размер файла в байтах, по превышению которого файл будет ротирован.
	* @param {String} destination - Директория, куда будут перемещены файлы. Абсолютный путь.
*/
function rotateFiles(files, maxSize, destination) {
	for (let i = 0; i < files.length; i += 1) {
		fs.stat(files[i], (error, stats) => {
			if (error) { throw error; }
			if (stats.size < maxSize) { return; }
			
			fs.readFile(files[i], (error, content) => {
				if (error) { throw error; }
				if (!content.length) { return; }
				
				let date = new Date().toISOString().replace('T', '_').replace(/:/g, '-').replace(/\.\d+?Z$/, '');
				const NEW_FILE = path.resolve(destination, `${path.parse(files[i]).name}__${date}.log`);
				
				fs.appendFile(NEW_FILE, content, (error) => {
					if (error) { throw error; }
					
					fs.truncate(files[i], 0, (error) => { if (error) { throw error; } });
				});
			});
		});
	}
}
/**
	* @description Функция получения списка всех файлов с определенным расширением из заданной директории.
	* @param {String} dir - Где искать. Абсолютный путь.
	* @param {String} ext - Расширение.
	* @returns {Array} Массив строк с абсолютными путями.
*/
function getFilesByType(dir, ext) {
	return fs.readdirSync(dir)
		.filter( (fileName) => fileName.endsWith(ext) )
		.map( (fileName) => path.resolve(dir, fileName) );
}
function logRequest(req, res, next) {
	next();
	
	req._log = {
		start: process.hrtime(),
		date:  new Date().toUTCString()
	};
	
	onHeaders(res, () => {
		res._log = {
			start: process.hrtime()
		};
	});
	onFinished(res, () => {
		let date      = req._log.date;
		let ip        = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
		let method    = req.method;
		let url       = req.originalUrl;
		let referrer  = req.headers['referer'] || req.headers['referrer'] || 'N/A';
		let userAgent = req.headers['user-agent'] || 'N/A';
		let status    = res.statusCode || 'N/A';
		
		let start   = req._log.start || [0, 0];
		let end     = res._log.start || [0, 0];
		let diff    = (end[0] * 1000 + end[1] / 1e6) - (start[0] * 1000 + start[1] / 1e6); // ms
		let resTime = `${Math.round(diff * 100) / 100} ms`;
		
		let record = `${[date, ip.padEnd(16), status, resTime.padEnd(10), method.padEnd(7), url.padEnd(30), referrer, userAgent].join('  |  ')}\r\n`;
		
		
		fs.appendFile(ACCESS_LOG, record, (error) => { if (error) { throw error; } });
	});
}

function handleRequest(req, res) {
	res.sendFile(INDEX_HTML);
}
function handleXMLHttpRequest(req, res, next) {
	let userIP = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
	let body   = (req.method === 'GET') ? req.query : req.body;
	
	if (!req.xhr || !body) { next(); return; }
	
	switch (body.q) {
		case 'events_list': getEventsList(+body.newest, res); break;
		case 'shorten_url': isRequestAllowed(userIP) ? shortenURL(body, res) : res.status(503).send('Превышен лимит количества запросов. Пожалуйста, попробуйте позже.'); break;
	}
}
function handleShortenedUrlRequest(req, res, next) {
	const PATH = decodeURIComponent(req.path.slice(1)).toLowerCase().replace(/\/$/, '');
	
	db('CALL sp_getUrl(?)', [PATH]).then(
		resolve => { res.redirect(301, resolve[0].url); },
		reject  => { next(); log(reject, { type: 'error' }); }
	);
}


app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		styleSrc:   ["'self'", "'unsafe-inline'"]
	}
}));
app.use(express.static(STATIC_DIR, { index: false }));
app.use(logRequest);


// Адрес вида "site.com/xhr". Сюда для удобства направляются все XHR запросы:
app.get(/^\/xhr$/, handleXMLHttpRequest);
app.post(/^\/xhr$/, upload.array(), handleXMLHttpRequest);

// Адрес вида "site.com/abc". Такие адреса генерирует сокращалка:
app.get(/^\/(\w|-|%)+(\/?)$/, handleShortenedUrlRequest);

// Адрес, не подходящий под предыдущие шаблоны:
app.get('*', handleRequest);


if (USE_HTTPS) {
	https.createServer({
		cert: fs.readFileSync(SSL_CERT),
		key:  fs.readFileSync(SSL_KEY)
	}, app).listen(PORT);
} else {
	app.listen(PORT);
}
log(`HTTP${USE_HTTPS ? 'S' : ''} server started on port ${PORT}.`, { type: 'info' });