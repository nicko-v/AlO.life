'use strict';

function shortenUrl(database, nestor) {
	const Ban           = require('../modules/ban.js');
	const config        = require('../config/config.js');
	const validateAlias = require('../modules/validate-alias.js');
	const validateUrl   = require('../modules/validate-url.js');
	
	const ban = new Ban(5000);
	
	
	return function(req, res, next) {
		if (!req.xhr || !req.body) {
			next();
			return;
		}
		if (ban.isBanned(req.realIp)) {
			res.status(503).send('Превышен лимит количества запросов. Пожалуйста, попробуйте позже.');
			return;
		}
		
		let address = decodeURIComponent(req.body.url);
		const alias = req.body.alias ? req.body.alias.toLowerCase() : '';
		
		if (address.search(/^(ftp|http|https):\/\//) === -1) { address = 'http://' + address; }
		
		try {
			// Допустимые длины следует менять вместе с их аналогами на фронте:
			validateUrl(address, 10, 2000);
			validateAlias(alias, 4, 50);
			
			const query = alias.length ?
				database.query('CALL sp_addUrlWithUserAlias(?, ?)', [address, alias], true) :
				database.query('CALL sp_addUrlWithAutoAlias(?)', [address]);
			
			query.then(
				resolve => {
					const resultUrl = `http${config.useHttps ? 's' : ''}://${config.hostname}/${req.body.alias || resolve[0].aliasB36}`;
					
					res.location(resultUrl);
					res.status(201).send();
				},
				reject  => {
					if (reject.search(/duplicate\sentry/i) > -1) {
						res.status(400).send(`Сокращение "${req.body.alias}" уже занято.`);
					} else {
						res.status(400).send('Произошла непредвиденная ошибка.');
						nestor.log(reject, { type: 'error' });
					}
				}
			);			
		} catch (error) {
			res.status(400).send(error.message);
			nestor.log(error.message, { type: 'error' });
		}
	};
}


module.exports = shortenUrl;
