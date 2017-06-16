const PORT = 8080;
const HOSTNAME  = 'alo.life';
const LOGFORMAT = 'IP:            :req[X-Forwarded-For]\\r\\n' +
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
	    alias.length < MIN_ALIAS_LENGTH) { throw new WrongInput('alias', `Длина названия должна быть от ${MIN_ALIAS_LENGTH} до ${MAX_ALIAS_LENGTH} символ${wordEnding(MAX_ALIAS_LENGTH)}.`); }
	if (!aliasRegexp.test(alias))        { throw new WrongInput('alias', 'Некорректное название. Допустимы символы A-z, А-я, 0-9, -, _'); }
	
	// Свойство hostname объекта url содержит имя хоста без протокола, порта и пути, кодированное в punycode, что упрощает проверку:
	let hname = url.parse(address).hostname;
	if (hname.length < 4 ||
	    hname.length > 255 ||
	    hname.indexOf(HOSTNAME) > -1 ||
	    !addressRegexp.test(hname)) {
		throw new WrongInput('url', 'Некорректная ссылка.');
	}
}
function getEventsList(req, res) {
	let columns = "event_header AS 'name', event_descr AS 'descr', event_icon AS 'icon', event_date AS 'date'";
	
	db(`SELECT ${columns} FROM timeline_events ORDER BY event_date ${+req.query.newest ? 'DESC' : 'ASC'}`, []).then(
		result => res.status(200).send(result),
		error  => { res.status(500).send(); logger(error, 'error'); }
	);
}
function shortenURL(req, res) {
	let address = req.query.url;
	let alias   = req.query.alias.toLowerCase();
	
	function createAlias(random = false) {
		return (Date.now() - new Date(2017, 5, 1) + random ? Math.ceil(Math.random() * 1000) : 0).toString(36);
	}
	
	if (address.search(/^(ftp|http|https):\/\//) === -1) { address = 'http://' + address; }
	/*
	try {
		validateInput(address, alias);
		if (alias.length) {
			db('SELECT url_alias FROM shortened_urls WHERE url_alias=?', [alias])
				.then(
					resolve => { res.status(400).send(`Сокращение "${req.query.alias}" уже занято.`); },
					reject  => db('INSERT INTO shortened_urls (url_full, url_alias) VALUES (?, ?)', [address, alias], true)
				)
				.then(
					resolve => { res.status(200).send(`Ссылка сокращена: ${HOSTNAME}/${alias}`); },
					reject  => { res.status(500).send(reject); logger(reject, 'error'); }
				);
		} else {
			alias = createAlias();
		}
	} catch (error) {
		res.status(400).send(error); logger(error, 'error');
	}*/
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


/* Работа с БД */
let pool = mysql.createPool({
	connectionLimit: 100,
	host           : 'localhost',
	database       : ID.database,
	user           : ID.login,
	password       : ID.password
});

function db(query, values, allowEmptyResponse = false) {
	// Флаг allowEmptyResponse подразумевает обязательность возврата результата. Если данные не найдены и флаг false, промис отклоняется.
	// Пример использования: прерывание цепочки промисов в случае ненахождения данных или продолжение цепочки в случае,
	// если возврат данных не требуется - например, при операции записи в базу.
	
	return new Promise( (resolve, reject) => {
		
		pool.getConnection( (error, connection) => {
			if (error) { reject('Error in connection to database.'); return; } // Ошибка при попытке создания соединения.
			
			connection.query(query, values, (error, rows) => {
				connection.release();
				if (error) { // Ошибка запроса к БД.
					reject(error.message);
				} else if (rows.length === 0 && allowEmptyResponse === false) {
					reject(`No data found for query "${query}" [${values.join(', ')}]`);
				} else {
					// Объекты со строками могут находиться либо непосредственно внутри массива rows,
					// либо быть обернутыми в еще один массив в случае, если в основном массиве присутствуют другие объекты,
					// например OkPacket'ы, которые появляются при вызове процедуры или выполнении более одного запроса за раз.
					for (let i = 0; i < rows.length; i += 1) {
						if (rows[i].constructor.name === 'RowDataPacket') { resolve(rows); return; }
						if (Array.isArray(rows[i]) && rows[i].length && rows[i][0].constructor.name === 'RowDataPacket') { resolve(rows[i]); return; }
					}
					// Если объект со строками все же не найден - промис отклоняется:
					reject(`No data found for query "${query}" [${values.join(', ')}]`);
				}
			});
		});
		
	});
}
/* -=-=-=- */


/* Логирование запросов к серверу */
fs.existsSync(logDir) || fs.mkdirSync(logDir);
let accessLogStream = rfs('access.log', {
	interval: '1d',
	path: logDir
});
app.use(morgan(morgan.compile(LOGFORMAT), { stream: accessLogStream }));
/* -=-=-=- */


/* Маршрутизация */
// Адрес вида "site.com/s/abc". Это основные страницы сайта. Отдается index.html для дальнейшей маршрутизации на фронте.
app.get(/^\/((s\/)(\w+)?(\/)?)?$/, (req, res) => {
	if (Object.keys(req.query).length === 0) { // Если в адресе нет параметров GET запроса.
		res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
	} else {
		switch (req.query.q) {
			case 'eventslist': getEventsList(req, res); break;
			case 'shortenURL': shortenURL(req, res); break;
		}
	}
	
});

// Адреса вида "site.com/abc". Такие адреса генерирует сокращалка. Редирект на полный адрес, либо возврат index.html, если запись не найдена.
app.get(/^\/(\w|\-)+\/?$/, (req, res) => {
	
	const PATH = req.path.slice(1).toLowerCase();
	
	db('CALL sp_getUrl(?)', [PATH]).then(
		resolve => { res.redirect(301, resolve[0].url_full); },
		reject  => { res.sendFile(path.resolve(__dirname, '../app/public/index.html')); logger(reject, 'error'); }
	);
});
/* -=-=-=- */


app.listen(PORT);
/*https.createServer({
	cert: fs.readFileSync(path.resolve(__dirname, './ssl_keys/fullchain.pem')),
	key:  fs.readFileSync(path.resolve(__dirname, './ssl_keys/privkey.pem'))
}, app).listen(PORT);*/
console.log(`Server started on port ${PORT}.`);