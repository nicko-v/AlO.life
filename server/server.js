const PORT       = 8080;
const HOSTNAME   = 'alo.life';
const USE_HTTPS  = true;
const LOG_FORMAT = 'IP:            :req[X-Forwarded-For]\\r\\n' +
                   'URL:           :url\\r\\n' +
                   'Date:          :date[clf]\\r\\n' +
                   'Method:        :method\\r\\n' +
                   'Referrer:      :referrer\\r\\n' +
                   'HTTP:          :http-version\\r\\n' +
                   'Status:        :status\\r\\n' +
                   'Response time: :response-time[3] ms\\r\\n' +
                   'User agent:    :user-agent\\r\\n\\r\\n';

let express = require('express');
let https   = require('https');
let fs      = require('fs');
let path    = require('path');
let url     = require('url');
let morgan  = require('morgan');
let rfs     = require('rotating-file-stream');
let mysql   = require('mysql');
let helmet  = require('helmet');
let logger  = require('./logger.js');
let ID      = require('./id.js');

let app    = express();
let logDir = path.resolve(__dirname, './logs');

let pool = mysql.createPool({
	connectionLimit: 100,
	host           : 'localhost',
	database       : ID.database,
	user           : ID.login,
	password       : ID.password
});

/**
	* @description Функция обращения к БД.
	* @param {String} query - Запрос. Значения могут быть заменены "?" и передаваться отдельно.
	* @param {Array} values - Значения, замененные в запросе "?", или пустой массив.
	* @param {Boolean} allowEmptyResponse - Обязательность возврата результата.
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
	const MAX_ADDRESS_LENGTH = 1000;
	const MIN_ADDRESS_LENGTH = 10;
	const MAX_ALIAS_LENGTH   = 50;
	const MIN_ALIAS_LENGTH   = 4;
	
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
	let columns = "event_header AS 'name', event_descr AS 'descr', event_icon AS 'icon', event_date AS 'date'";
	
	db(`SELECT ${columns} FROM timeline_events ORDER BY event_date ${isNewestFirst ? 'DESC' : 'ASC'}`, []).then(
		resolve => { res.status(200).send(resolve); },
		reject  => { res.status(500).send(); logger(reject, 'error'); }
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
						logger(reject, 'error');
					}
				}
			);
		} else {
			db('CALL sp_addUrlWithAutoAlias(?)', [address]).then(
				resolve => { res.status(200).send(`http${USE_HTTPS ? 's' : ''}://${HOSTNAME}/${resolve[0].aliasB36}`); },
				reject  => { res.status(400).send('Произошла непредвиденная ошибка.'); logger(reject, 'error'); }
			);
		}
	} catch (error) {
		res.status(400).send(error.message); logger(error.message, 'error');
	}
}
function handleXHR(req, res, next) {
	if (Object.keys(req.query).length === 0) { next(); return; }
	
	switch (req.query.q) {
		case 'events_list': getEventsList(+req.query.newest, res); break;
		case 'shorten_url': shortenURL(req.query, res); break;
		default: res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
	}
}


app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		styleSrc: ["'self'", "'unsafe-inline'"]
	}
}));
app.use(express.static(path.resolve(__dirname, '../app/public')));
app.use(/^\/xhr$/, handleXHR); // Адрес вида "site.com/xhr". Сюда направляются все XHR запросы. Отдельный путь позволяет ограничить запросы к базе.


/* Логирование запросов к серверу */
fs.existsSync(logDir) || fs.mkdirSync(logDir);
let accessLogStream = rfs('access.log', {
	interval: '1d',
	path: logDir
});
app.use(morgan(morgan.compile(LOG_FORMAT), { stream: accessLogStream }));
/* -=-=-=- */


/* Маршрутизация */
// Адрес вида "site.com/", site.com/s/abc". Это основные страницы сайта. Отдается index.html для дальнейшей маршрутизации на фронте.
app.get(/^\/((s\/)(\w+)?(\/)?)?$/, (req, res) => {
	res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
});

// Адреса вида "site.com/abc". Такие адреса генерирует сокращалка. Редирект на полный адрес, либо возврат index.html, если запись не найдена.
app.get(/^\/(\w|\-|%)+\/?$/, (req, res) => {
	
	const PATH = decodeURIComponent(req.path.slice(1)).toLowerCase();
	
	db('CALL sp_getUrl(?)', [PATH]).then(
		resolve => { res.redirect(301, resolve[0].url_full); },
		reject  => { res.sendFile(path.resolve(__dirname, '../app/public/index.html')); logger(reject, 'error'); }
	);
});
/* -=-=-=- */


if (USE_HTTPS) {
	https.createServer({
		cert: fs.readFileSync(path.resolve(__dirname, '../../ssl_keys/fullchain.pem')),
		key:  fs.readFileSync(path.resolve(__dirname, '../../ssl_keys/privkey.pem'))
	}, app).listen(PORT);
} else {
	app.listen(PORT);
}
console.log(`\x1b[45m${new Date().toUTCString()}  -::-  Server started on port ${PORT}.\x1b[0m`);