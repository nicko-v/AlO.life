'use strict';

const model  = require('../models/unshort-url.model.js');
const nestor = require('../modules/nestor.js');


function unshortUrl(req, res, next) {
	const alias = decodeURIComponent(req.path.slice(1)).replace(/\/$/, '');
	
	model.unshort(alias)
		.then(url => res.redirect(301, url))
		.catch(error => {
			next();
			nestor.log(error, { type: 'shortener-notfound' });
		});
}


module.exports = unshortUrl;