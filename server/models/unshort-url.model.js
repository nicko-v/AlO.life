'use strict';

const pool = require('../modules/pool.js');


const model = {
	unshort(alias) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) {
					reject(error);
					return;
				}
				
				connection.query('CALL sp_getUrl(?)', [alias], (error, rows) => {
					connection.release();
					error ? reject(error) :
						rows[0].length ? resolve(rows[0][0].url) : reject(new Error(`Alias ${alias} doesn't exist`));
				});
			});
			
		});
	}
};


module.exports = model;