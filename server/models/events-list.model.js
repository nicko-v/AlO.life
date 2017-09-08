'use strict';

const pool = require('../modules/pool.js');


const model = {
	getAll(order) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) {
					reject(error);
					return;
				}
				
				connection.query(`SELECT * FROM timeline_events ORDER BY date ${order}`, (error, rows) => {
					connection.release();
					if (error) {
						reject(error);
						return;
					} else {
						const result = rows.map(event => {
							const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' });
							
							return {
								id:    event.id,
								name:  event.header,
								descr: event.descr || '',
								icon:  event.icon || 'info',
								date: {
									year:  event.date.getFullYear(),
									month: event.date.getMonth() + 1,
									day:   event.date.getDate(),
									dayOfMonth: formatter.format(event.date)
								}
							};
						});
						resolve(result);
					}
				});
			});
			
		});
	}
};


module.exports = model;