'use strict';

function unshortUrl(database, nestor) {
	return function(req, res, next) {
		const path = decodeURIComponent(req.path.slice(1)).toLowerCase().replace(/\/$/, '');
	
		database.query('CALL sp_getUrl(?)', [path]).then(
			resolve => { res.redirect(301, resolve[0].url); },
			reject  => { next(); nestor.log(reject, { type: 'notfound' }); }
		);
	};
}


module.exports = unshortUrl;