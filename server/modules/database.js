'use strict';

const mysql = require('mysql');


class DataBase {
	constructor(connectionOptions) {
		this.pool = this._createPool(connectionOptions);
	}
	
	query(query, values, allowEmptyResponse = false) {
		return new Promise( (resolve, reject) => {
			
			this.pool.getConnection( (error, connection) => {
				if (error) { reject('Error in connection to database.'); return; } // Ошибка при попытке создания соединения.
				
				connection.query(query, values, (error, rows) => {
					connection.release();
					
					// Ошибка запроса к БД:
					if (error) { reject(error.message); return; }
					// Данные в ответ не ожидаются:
					if (allowEmptyResponse) { resolve(); return; }
					// Данные ожидаются, но не найдены:
					if (!allowEmptyResponse && rows.length === 0) { reject(`No data found for query "${query}" [${values.join(', ')}]`); return; }
					
					/* Данные ожидаются и найдены: */
					// Ищется объект со строками, он может быть либо в корне массива-ответа, либо обернут в еще один массив:
					for (let i = 0; i < rows.length; i += 1) {
						if (rows[i].constructor.name === 'RowDataPacket') { resolve(rows); return; }
						if (Array.isArray(rows[i]) && rows[i].length && rows[i][0].constructor.name === 'RowDataPacket') { resolve(rows[i]); return; }
					}
					// Если объект со строками все же не найден:
					reject(`No data found for query "${query}" [${values.join(', ')}]`);
					/* -=-=-=- */
				});
			});
			
		});
	}
	
	_createPool(options) {
		return mysql.createPool(options);
	}
}


module.exports = DataBase;
