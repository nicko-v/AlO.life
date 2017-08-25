'use strict';

const pool = require('../modules/pool.js');


const model = {
	unshort(alias) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) { throw error; }
				
				connection.query('CALL sp_getUrl(?)', [alias], (error, rows) => {
					connection.release();
					error ? reject(error) : resolve(rows[0][0].url);
				});
			});
			
		});
	}
};


module.exports = model;