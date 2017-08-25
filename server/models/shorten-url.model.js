'use strict';

const pool = require('../modules/pool.js');


const model = {
	shortenUrl(url, alias) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) { throw error; }
				
				connection.query(alias ? 'CALL sp_addUrlWithUserAlias(?, ?)' : 'CALL sp_addUrlWithAutoAlias(?)', [url, alias], (error, rows) => {
					connection.release();
					error ? reject(error) : resolve(rows[0][0].alias);
				});
			});
			
		});
	}
};


module.exports = model;