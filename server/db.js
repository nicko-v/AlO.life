module.exports = {
	createConnection() {
		let ID    = require('./credentials.js');
		let mysql = require('mysql');
		
		return mysql.createConnection({
			host    : 'localhost',
			database: 'alolife',
			user    : ID.login,
			password: ID.password
		});
	},
	
	getData(query) {
		return new Promise( (resolve, reject) => {
			let connection = this.createConnection();
			
			connection.query(query, function (error, rows) {
				if (error) {
					reject(error.message);
				} else if (rows.length === 0) {
					reject(`No data found for ${query}`);
				} else {
					resolve(rows);
				}
			});
			
			connection.end();
		});
	},
	
	addData(query) {
		let logger = require('./logger.js');
		let connection = this.createConnection();
		
		connection.connect();
	
		connection.query(query, function (error) {
			if (error) { logger(error.message, 'error'); }
		});
		
		connection.end();
	}
};