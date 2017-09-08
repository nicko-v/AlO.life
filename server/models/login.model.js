'use strict';

const fs      = require('fs');
const request = require('request');
const config  = require('../config/config.js');
const paths   = require('../config/paths.js');
const pool    = require('../modules/pool.js');

const secret = JSON.parse(fs.readFileSync(paths.secret, 'utf8'));


const model = {
	getAccessToken(code) {
		const id = secret.vkAppId;
		const cs = secret.vkClientSecret;
		const redirect = config.oauthRedirect;
		
		const uri = `https://oauth.vk.com/access_token?client_id=${id}&client_secret=${cs}&redirect_uri=${redirect}&code=${code}`;
		
		
		return new Promise((resolve, reject) => {
			
			request({ uri, json: true }, (error, res, body) => {
				if (error) {
					reject(error);
					return;
				}
				if (body.error) {
					reject(new Error(`${body.error}: ${body.error_description}`));
					return;
				}
				if (body && body.access_token) {
					resolve(body);
				} else {
					reject(new Error(`Cannot retrieve data from ${uri.replace(cs, 'hidden')}`));
				}
			});
			
		});
	},
	
	isUserExists(id) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) {
					reject(error);
					return;
				}
				
				connection.query('SELECT id FROM users WHERE id = ? LIMIT 1', [id], (error, rows) => {
					connection.release();
					error ? reject(error) : resolve(rows.length ? true : false);
				});
			});
			
		});
	},
	
	getUserData(token, email) {
		const uri = `https://api.vk.com/method/users.get?fields=bdate,sex,country,city,photo_max&v=5.67&access_token=${token}`;
		
		function jsonReviver(key, value) {
			switch (key) {
				case 'bdate':
					value = value.split('.');
					if (value.length < 3) { value.push('1000'); }
					value.reverse();
					return value.join('-');
				case 'country':
				case 'city': return value.title;
			}
			return value;
		}
		
		return new Promise((resolve, reject) => {
			
			request({ uri, json: true, jsonReviver }, (error, res, body) => {
				if (error) {
					reject(error);
					return;
				}
				if (body.error) {
					reject(new Error(body.error.error_msg));
					return;
				}
				if (body && body.response) {
					const data = body.response[0];
					data.email = email;
					resolve(data);
				} else {
					reject(new Error(`Cannot retrieve data from ${uri.replace(token, 'hidden')}`));
				}
			});
			
		});
	},
	
	addOrUpdateUser({ id, first_name: name, email, sex, photo_max: avatar }, userExists) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) {
					reject(error);
					return;
				}
				
				const action = userExists ? 'updateUser' : 'addUser';
				
				connection.query(`CALL sp_${action}(?, ?, ?, ?, ?)`, [id, nickname, email, sex, avatar], (error, rows) => {
					connection.release();
					error ? reject(error) : resolve(id);
				});
			});
			
		});
	},
};


module.exports = model;