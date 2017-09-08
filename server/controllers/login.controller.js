'use strict';

const model  = require('../models/login.model.js');
const nestor = require('../modules/nestor.js');


async function handleLoginAttempt(code) {
	const { user_id, access_token, email } = await model.getAccessToken(code);
	const userData   = await model.getUserData(access_token, email);
	const userExists = await model.isUserExists(user_id);
	const id         = await model.addOrUpdateUser(userData, userExists);
	
	
	return id;
}
function login(req, res, next) {
	if (!Object.keys(req.query).length) {
		next();
		return;
	} 
	
	if (req.query.error) {
		nestor.log(`${req.query.error} (${req.query.error_description})`, { type: 'error-auth', toConsole: false });
		return;
	}
	
	handleLoginAttempt(req.query.code)
		.then(id => {
			req.session.user = id;
			res.redirect('/');
		})
		.catch(error => nestor.log(error, { type: 'error-auth' }));
}


module.exports = login;