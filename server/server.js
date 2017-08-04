'use strict';

const express        = require('express');
const expressSession = require('express-session');
const ems            = require('express-mysql-session');
const fs             = require('fs');
const https          = require('https');
const config         = require('./config/config.js');
const DataBase       = require('./modules/database.js');
const Nestor         = require('./modules/nestor.js');
const paths          = require('./config/paths.js');
const router         = require('./router.js');


const nestor = new Nestor(paths.logs, paths.logsOld);
nestor.watch(config.maxLogFileSize, config.logsCheckInterval); // Следить за размером логов и делать ротацию.


// Проверка и создание при необходимости ресурсов, исключенных из git:
if (!fs.existsSync(paths.secret))  { createSecret(paths.secret); }


const secret       = JSON.parse(fs.readFileSync(paths.secret));
const app          = express();
const MySqlStore   = ems(expressSession);
const database     = new DataBase({
	connectionLimit: 100,
	host: 'localhost',
	port: 3306,
	database: secret.database,
	user:     secret.user,
	password: secret.password
});
const sessionStore = new MySqlStore({}, database.pool);
const sessionOptions = {
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
}


function createSecret(path) {
	let secret = { database: 'alolife', user: 'alo_life', password: '000', cookiesSecret: '000' };
	
	fs.appendFileSync(path, JSON.stringify(secret));
	nestor.log('No "secret.json" file found. A new one was just created. You must edit it by specifying correct credentials, then relaunch app.', { type: 'warn' });
}
function setReqIp(req, res, next) {
	req.realIp = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
	next();
}
function setResHeaders(req, res, next) {
	res.set({
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'X-Download-Options': 'noopen',
		'X-DNS-Prefetch-Control': 'off',
		'Strict-Transport-Security': `max-age=${90 * 24 * 60 * 60}; includeSubDomains`,
		'X-XSS-Protection': '1; mode=block',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
		'Content-Security-Policy': `default-src 'self'; style-src 'self' 'unsafe-inline'`,
	});
	
	res.removeHeader('X-Powered-By');
	
  next();
}


app.use(setResHeaders);
app.use(express.static(paths.build, { index: false }));
app.use(expressSession(sessionOptions));
app.use(setReqIp);
app.use(nestor.logHttpRequest);
app.use(router(database, nestor));


if (config.useHttps) {
	https.createServer({
		cert: fs.readFileSync(paths.sslCert),
		key:  fs.readFileSync(paths.sslKey)
	}, app).listen(config.port);
} else {
	app.listen(config.port);
}
nestor.log(`HTTP${config.useHttps ? 'S' : ''} server started on port ${config.port}.`, { type: 'info' });
