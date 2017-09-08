'use strict';

const nestor = require('../modules/nestor.js');


function users(req, res, next) {
	if (!req.xhr || (!Object.keys(req.query).length && !req.body)) {
		next();
		return;
	}
	
	const query  = req.body || req.query; // undefined || {}
	const action = query.action;
	
	
	switch (action) {
		case 'isLoggedIn':
			const isLoggedIn = (req.session || {}).user !== undefined;
			res.status(200).json(isLoggedIn);
			break;
		case 'logout':
			if (req.session) {
				req.session.destroy(error => error ? res.status(500).json(error) : res.status(200).send(''));
			}
			break;
	}
}


module.exports = users;