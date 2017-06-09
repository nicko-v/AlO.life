const PORT = 8080;
const LOGFORMAT = 'IP:            :req[X-Forwarded-For]\\r\\n' +
                  'URL:           :url\\r\\n' +
                  'Date:          :date[clf]\\r\\n' +
                  'Method:        :method\\r\\n' +
                  'Referrer:      :referrer\\r\\n' +
                  'HTTP:          :http-version\\r\\n' +
                  'Status:        :status\\r\\n' +
                  'Response time: :response-time[3] ms\\r\\n' +
                  'User agent:    :user-agent\\r\\n\\r\\n';

let express     = require('express');
let https       = require('https');
let fs          = require('fs');
let path        = require('path');
let morgan      = require('morgan');
let rfs         = require('rotating-file-stream');
let mysql       = require('mysql');
let helmet      = require('helmet');
let logger      = require('./logger.js');
let ID          = require('./id.js');

let app    = express();
let logDir = path.resolve(__dirname, './logs');


function getEventsList(req, res) {
	let columns = "event_header AS 'name', event_descr AS 'descr', event_icon AS 'icon', event_date AS 'date'";
	let promise = db(`SELECT ${columns} FROM timeline_events ORDER BY event_date ${+req.query.newest ? 'DESC' : 'ASC'}`);
	
	promise.then(
		result => res.send(result),
		error  => { res.status(500); logger(error, 'error'); }
	);
}
function shortenURL(req, res) {
	const FULLURL  = req.query.fullURL;
	const SHORTURL = req.query.shortURL || undefined;
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

function db(query, allowEmptyResponse = false) {
	// Флаг allowEmptyResponse подразумевает обязательность возврата результата. Если данные не найдены и флаг false, промис отклоняется.
	// Пример использования: прерывание цепочки промисов в случае ненахождения данных или продолжение цепочки в случае,
	// если возврат данных не требуется - например, при операции записи в базу.
	
	return new Promise( (resolve, reject) => {
		
		pool.getConnection( (error, connection) => {
			if (error) { reject('Error in connection to database.'); return; } // Ошибка при попытке создания соединения.
			
			connection.query(query, (error, rows) => {
				connection.release();
				if (error) { // Ошибка запроса к БД.
					reject(error.message);
				} else if (rows.length === 0 && allowEmptyResponse === false) {
					reject(`No data found for query ${query}`);
				} else {
					resolve(rows);
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
	
	const PATH = req.path.slice(1);
	
	db(`SELECT url_full FROM shortened_urls WHERE url_short = '${PATH}' LIMIT 1`)
		.then(result => {
			res.redirect(301, result[0].url_full);
			return db(`UPDATE shortened_urls SET url_asked = url_asked + 1 WHERE url_short = '${PATH}'`, true);
		})
		.then(null)
		.catch(error => {
			res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
			logger(error, 'error');
		});
	
});
/* -=-=-=- */


app.listen(PORT);
/*https.createServer({
	cert: fs.readFileSync(path.resolve(__dirname, './ssl_keys/fullchain.pem')),
	key:  fs.readFileSync(path.resolve(__dirname, './ssl_keys/privkey.pem'))
}, app).listen(PORT);*/
console.log(`Server started on port ${PORT}.`);