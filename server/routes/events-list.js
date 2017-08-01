'use strict';

function eventsList(database, nestor) {
	return function(req, res, next) {
		if (!req.xhr || !req.query) { next(); return; }
		
		database.query(`SELECT header, descr, icon, date FROM timeline_events ORDER BY date ${+req.query.newestFirst ? 'DESC' : 'ASC'}`, []).then(
			resolve => { res.status(200).send(resolve); },
			reject  => {
				res.status(500).send();
				nestor.log(reject, { type: 'error' });
			}
		);
	};
}


module.exports = eventsList;