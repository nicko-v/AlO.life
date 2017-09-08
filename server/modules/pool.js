'use strict';

const fs     = require('fs');
const mysql  = require('mysql');
const paths  = require('../config/paths.js');

const secret = JSON.parse(fs.readFileSync(paths.secret, 'utf8'));


const pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	port: 3306,
	database: secret.db_name,
	user:     secret.db_user,
	password: secret.db_pass
});


module.exports = pool;
