'use strict';

function index(req, res) {
	const paths = require('../config/paths.js');
	
	res.sendFile(paths.index);
}


module.exports = index;