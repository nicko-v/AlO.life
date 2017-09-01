'use strict';

const Ban            = require('../modules/ban.js');
const config         = require('../config/config.js');
const model          = require('../models/shorten-url.model.js');
const nestor         = require('../modules/nestor.js');
const ShortenerError = require('../utils/shortenerError.js');
const validateAlias  = require('../utils/validate-alias.js');
const validateUrl    = require('../utils/validate-url.js');

const ban = new Ban(5000);


function shortenUrl(req, res, next) {
	if (!req.xhr || !req.body) {
		next();
		return;
	}
	if (ban.isBanned(req.realIp)) {
		res.status(503).json(new ShortenerError('', 'Превышен лимит количества запросов. Пожалуйста, попробуйте позже.'));
		return;
	}
	
	let url     = decodeURIComponent(req.body.url);
	const alias = req.body.alias;
	
	if (url.search(/^(ftp|http|https):\/\//) === -1) { url = 'http://' + url; }
	
	try { // Допустимые длины следует менять вместе с их аналогами на фронте:
		validateUrl(url, 10, 2000);
		validateAlias(alias, 4, 50);
	} catch (error) {
		res.status(400).json(error);
		return;
	}
	
	
	model.shortenUrl(url, alias)
		.then(createdAlias => {
			const resultUrl = `http${config.useHttps ? 's' : ''}://${config.hostname}/${createdAlias}`;
			
			res.location(resultUrl);
			res.status(201).send();
		})
		.catch(error => {
			if (error.message.search(/duplicate\sentry/i) > -1) {
				res.status(400).json(new ShortenerError('alias', `Сокращение "${req.body.alias}" уже занято.`));
			} else {
				res.status(400).json(new ShortenerError('', 'Произошла непредвиденная ошибка.'));
				nestor.log(error, { type: 'error' });
			}
		});
}


module.exports = shortenUrl;