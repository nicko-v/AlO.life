'use strict';

const express        = require('express');
const expressSession = require('express-session');
const ems            = require('express-mysql-session');
const fs             = require('fs');
const helmet         = require('helmet');
const https          = require('https');
const multer         = require('multer');
const path           = require('path');
const url            = require('url');
const config         = require('./config/config.js');
const DataBase       = require('./modules/database.js');
const Nestor         = require('./modules/nestor.js');
const paths          = require('./config/paths.js');


// Проверка и создание при необходимости ресурсов, исключенных из git:
if (!fs.existsSync(paths.secret))  { createSecret(paths.secret); }


const secret       = JSON.parse(fs.readFileSync(paths.secret));
const stopList     = {
	shortener: { users: new Set(), timeout: 5000 }
};
const app          = express();
const upload       = multer();
const MySqlStore   = ems(expressSession);
const nestor       = new Nestor(paths.logs, paths.logsOld);
const database     = new DataBase({
	connectionLimit: 100,
	host: 'localhost',
	port: 3306,
	database: secret.database,
	user:     secret.user,
	password: secret.password
});
const sessionStore = new MySqlStore({}, database.pool);

// Следить за размером логов и делать ротацию:
nestor.watch(config.maxLogFileSize, config.logsCheckInterval);


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
	    hname.toLowerCase().indexOf(config.hostname) > -1 ||
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
	database.query(`SELECT header, descr, icon, date FROM timeline_events ORDER BY date ${isNewestFirst ? 'DESC' : 'ASC'}`, []).then(
		resolve => { res.status(200).send(resolve); },
		reject  => {
			res.status(500).send();
			nestor.log(reject, { type: 'error' });
		}
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
			database.query('CALL sp_addUrlWithUserAlias(?, ?)', [address, alias], true).then(
				resolve => {
					res.location(`http${config.useHttps ? 's' : ''}://${config.hostname}/${query.alias}`);
					res.status(201).send();
				},
				reject  => {
					if (reject.search(/duplicate\sentry/i) > -1) {
						res.status(400).send(`Сокращение "${query.alias}" уже занято.`);
					} else {
						res.status(400).send('Произошла непредвиденная ошибка.');
						nestor.log(reject, { type: 'error' });
					}
				}
			);
		} else {
			database.query('CALL sp_addUrlWithAutoAlias(?)', [address]).then(
				resolve => {
					res.location(`http${config.useHttps ? 's' : ''}://${config.hostname}/${resolve[0].aliasB36}`);
					res.status(201).send();
				},
				reject  => {
					res.status(400).send('Произошла непредвиденная ошибка.');
					nestor.log(reject, { type: 'error' });
				}
			);
		}
	} catch (error) {
		res.status(400).send(error.message);
		nestor.log(error.message, { type: 'error' });
	}
}
/**
	* @description Функция проверки наличия IP адреса в указанном ограничительном списке.
	               Если адрес отсутствует - он вносится в указанный список и добавляется таймаут на его удаление.
	* @param {String} userIP - IP адрес, с которого сделан запрос.
	* @param {String} list - Список, в котором надо искать адрес.
	* @returns {Boolean}
*/
function isRequestAllowed(userIP, list) {
	if (stopList[list].users.has(userIP)) {
		return false;
	} else {
		stopList[list].users.add(userIP);
		setTimeout( () => { stopList[list].users.delete(userIP); }, stopList[list].timeout );
		
		return true;
	}
}
/**
	* @description Функция создания файла secret.json со значениями-заглушками для дальнейшего их заполнения.
	* @param {String} path - Путь к файлу secret.json.
	* @returns {Object} Объект со значениями-заглушками.
*/
function createSecret(path) {
	let secret = { database: 'alolife', user: 'alo_life', password: '000', cookiesSecret: '000' };
	
	fs.appendFileSync(path, JSON.stringify(secret));
	nestor.log('No "secret.json" file found. A new one was just created. You must edit it by specifying correct credentials, then relaunch app.', { type: 'warn' });
}

function handleRequest(req, res) {
	res.sendFile(paths.index);
}
function handleXMLHttpRequest(req, res, next) {
	let userIP = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
	let body   = (req.method === 'GET') ? req.query : req.body;
	
	if (!req.xhr || !body) { next(); return; }
	
	switch (body.q) {
		case 'events_list': getEventsList(+body.newest, res); break;
		case 'shorten_url': isRequestAllowed(userIP, 'shortener') ? shortenURL(body, res) : res.status(503).send('Превышен лимит количества запросов. Пожалуйста, попробуйте позже.'); break;
	}
}
function handleShortenedUrlRequest(req, res, next) {
	const PATH = decodeURIComponent(req.path.slice(1)).toLowerCase().replace(/\/$/, '');
	
	database.query('CALL sp_getUrl(?)', [PATH]).then(
		resolve => { res.redirect(301, resolve[0].url); },
		reject  => { next(); nestor.log(reject, { type: 'error' }); }
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
app.use(express.static(paths.build, { index: false }));
app.use(nestor.logHttpRequest);
app.use(expressSession({
	name: 'express.sid',
	proxy: config.isProduction,
	secret: secret.cookiesSecret,
	store: sessionStore,
	resave: false,
	rolling: false,
	saveUninitialized: false,
	unset: 'keep',
	cookie: {
		domain: config.cookiesDomain,
		secure: config.useHttps,
		path: '/',
		httpOnly: true,
		maxAge: (14 * 24 * 60 * 60 * 1000)
	}
}));


// Адрес вида "site.com/xhr". Сюда для удобства направляются все XHR запросы:
app.get(/^\/xhr$/, handleXMLHttpRequest);
app.post(/^\/xhr$/, upload.array(), handleXMLHttpRequest);

// Адрес вида "site.com/abc". Такие адреса генерирует сокращалка:
app.get(/^\/(\w|-|%)+(\/?)$/, handleShortenedUrlRequest);

// Адрес, не подходящий под предыдущие шаблоны:
app.get('*', handleRequest);


if (config.useHttps) {
	https.createServer({
		cert: fs.readFileSync(paths.sslCert),
		key:  fs.readFileSync(paths.sslKey)
	}, app).listen(config.port);
} else {
	app.listen(config.port);
}
nestor.log(`HTTP${config.useHttps ? 'S' : ''} server started on port ${config.port}.`, { type: 'info' });
