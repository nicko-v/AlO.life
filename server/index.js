'use strict';

const fs     = require('fs');
const paths  = require('./config/paths.js');
const nestor = require('./modules/nestor.js');


// Проверка и создание при необходимости ресурсов, исключенных из git:
if (!fs.existsSync(paths.secret))  { createSecret(paths.secret); }


const areIntlLocalesSupported = require('intl-locales-supported');
const localesMyAppSupports = ['ru'];

if (global.Intl) {
	if (!areIntlLocalesSupported(localesMyAppSupports)) {
		const IntlPolyfill  = require('intl');
		IntlPolyfill.__disableRegExpRestore();
		Intl.NumberFormat   = IntlPolyfill.NumberFormat;
		Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
	}
} else {
    global.Intl = require('intl');
		global.Intl.__disableRegExpRestore();
}


const express        = require('express');
const expressSession = require('express-session');
const ems            = require('express-mysql-session');
const https          = require('https');
const config         = require('./config/config.js');
const pool           = require('./modules/pool.js');
const router         = require('./modules/router.js');

const secret         = JSON.parse(fs.readFileSync(paths.secret, 'utf8'));
const app            = express();
const MySqlStore     = ems(expressSession);
const sessionStore   = new MySqlStore({}, pool);
const sessionOptions = {
	name: 'express.sid',
	proxy: config.useHttps,
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
};


function createSecret(path) {
	const secret = { db_name: 'alolife', db_user: 'alo_life', db_pass: '000', cookiesSecret: '000', vkClientSecret: '000', vkAppId: '000' };
	
	fs.appendFileSync(path, JSON.stringify(secret, '', 2));
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
app.use(router);


nestor.watch(config.maxLogFileSize, config.logsCheckInterval); // Следить за размером логов и делать ротацию.


if (config.useHttps) {
	https.createServer({
		cert: fs.readFileSync(paths.sslCert, 'utf8'),
		key:  fs.readFileSync(paths.sslKey, 'utf8')
	}, app).listen(config.port);
} else {
	app.listen(config.port);
}
nestor.log(`HTTP${config.useHttps ? 'S' : ''} server started on port ${config.port}.`, { type: 'info' });
