'use strict';

const model  = require('../models/events-list.model.js');
const nestor = require('../modules/nestor.js');


function eventsList(req, res, next) {
	if (!req.xhr || !Object.keys(req.query).length) {
		next();
		return;
	}
	
	const order = +req.query.newestFirst ? 'DESC' : 'ASC';
	
	model.getAll(order)
		.then(events => res.status(200).json(events))
		.catch(error => {
			res.status(500).send();
			nestor.log(error, { type: 'error' });
		});
}


module.exports = eventsList;