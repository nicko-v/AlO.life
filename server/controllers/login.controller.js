'use strict';

const model  = require('../models/login.model.js');
const nestor = require('../modules/nestor.js');


async function handleLoginAttempt(code) {
	const { user_id, access_token, email } = await model.getAccessToken(code);
	const userExists                       = await model.isUserExists(user_id);
	
	if (userExists) {
		return user_id;
	} else {
		const userData   = await model.getUserData(access_token, email);
		const created_id = await model.addUser(userData);
		
		return created_id;
	}
}
function login(req, res) {
	if (req.query.error) {
		nestor.log(`${req.query.error} (${req.query.error_description})`, { type: 'error-auth', toConsole: false });
		return;
	}
	
	handleLoginAttempt(req.query.code)
		.then(id => { req.session.user = id; })
		.catch(error => nestor.log(error, { type: 'error-auth' }));
}


module.exports = login;