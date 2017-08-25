'use strict';

const pool = require('../modules/pool.js');


const model = {
	getAll(order) {
		return new Promise((resolve, reject) => {
			
			pool.getConnection((error, connection) => {
				if (error) { throw error; }
				
				connection.query(`SELECT * FROM timeline_events ORDER BY date ${order}`, (error, rows) => {
					connection.release();
					if (error) {
						reject(error);
						return;
					} else {
						const result = rows.map(event => {
							const eventDate = new Date(event.date);
							const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' });
							
							return {
								id:    event.id,
								name:  event.header,
								descr: event.descr || '',
								icon:  event.icon || 'info',
								date: {
									year:  eventDate.getFullYear(),
									month: eventDate.getMonth() + 1,
									day:   eventDate.getDate(),
									dayOfMonth: formatter.format(eventDate)
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