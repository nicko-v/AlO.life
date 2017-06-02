const PORT = 8080;
const LOGFORMAT = 'IP:            :remote-addr\\r\\n' +
                  'URL:           :url\\r\\n' +
                  'Date:          :date[clf]\\r\\n' +
                  'Method:        :method\\r\\n' +
                  'Referrer:      :referrer\\r\\n' +
                  'HTTP:          :http-version\\r\\n' +
                  'Status:        :status\\r\\n' +
                  'Response time: :response-time[3] ms\\r\\n' +
                  'User agent:    :user-agent\\r\\n\\r\\n';

let express   = require('express');
let morgan    = require('morgan');
let fs        = require('fs');
let path      = require('path');
let rfs       = require('rotating-file-stream');
let db        = require('./db.js');
let logger    = require('./logger.js');

let app = express();
let logDirectory = path.resolve(__dirname, './logs');


/* Логирование запросов */
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs('access.log', {
	interval: '1d',
	path: logDirectory
});
app.use(morgan(morgan.compile(LOGFORMAT), { stream: accessLogStream }));
/* -=-=-=- */


app.use(express.static(path.resolve(__dirname, '../app/public')));


/* Адрес вида "site.com/s/abc". Это основные страницы сайта. Отдается index.html для дальнейшей маршрутизации на фронте. */
app.get(/^(\/s\/)(\w+)?(\/)?$/, (req, res) => {
	
	function getEventsList(req, res) {
		let columns = "event_header AS 'name', event_descr AS 'descr', event_icon AS 'icon', event_date AS 'date'";
		let promise = db.getData(`SELECT ${columns} FROM timeline_events ORDER BY event_date ${+req.query.newest ? 'DESC' : 'ASC'}`);
		
		promise.then(
			result => res.send(result),
			error  => { res.status(500).send(error); logger(error, 'error'); }
		);
	}
	
	if (Object.keys(req.query).length === 0) { // Если в адресе нет параметров GET запроса.
		res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
	} else {
		switch (req.query.q) {
			case 'eventslist': getEventsList(req, res); break;
		}
	}
	
});

/* Адреса вида "site.com/abc". Такие адреса генерирует сокращалка. Редирект на полный адрес, либо возврат index.html, если запись не найдена. */
app.get(/^\/(\w|\-)+\/?$/, (req, res) => {
	
	const PATH = req.path.slice(1);
	let promise = db.getData(`SELECT url_long FROM shortened_urls WHERE url_short = '${PATH}'`);
	
	res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	
	promise.then(
		result => {
			db.addData(`UPDATE shortened_urls SET url_asked = url_asked + 1 WHERE url_short = '${PATH}'`);
			res.redirect(301, result[0].url_long);
		},
		error  => {
			res.sendFile(path.resolve(__dirname, '../app/public/index.html'));
			logger(error, 'error');
		}
	);
	
});


app.listen(PORT, console.log(`Server started on port ${PORT}.`));