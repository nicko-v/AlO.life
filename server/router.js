function routerWrapper(database, nestor) {
	const bodyParser = require('body-parser');
	const router     = require('express').Router();
	const index      = require('./routes/index.js');
	const eventsList = require('./routes/events-list.js');
	const shortenUrl = require('./routes/shorten-url.js');
	const unshortUrl = require('./routes/unshort-url.js');
	
	
	router.use(nestor.logHttpRequest);
	
	router.get('/x/events-list', eventsList(database, nestor));
	router.post('/x/shorten-url', bodyParser.json(), shortenUrl(database, nestor));
	router.get(/^\/(\w|-|%)+(\/?)$/, unshortUrl(database, nestor));
	router.get('*', index);
	
	return router;
}


module.exports = routerWrapper;