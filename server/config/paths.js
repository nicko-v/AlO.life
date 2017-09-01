'use strict';

const path = require('path');

const logs    = path.resolve(__dirname, '../logs');
const logsOld = path.resolve(logs, './old');
const secret  = path.resolve(__dirname, './secret.json');
const build   = path.resolve(__dirname, '../../client/build');
const index   = path.resolve(build, './index.html');
const sslCert = path.resolve(__dirname, '../../../ssl_keys/fullchain.pem');
const sslKey  = path.resolve(__dirname, '../../../ssl_keys/privkey.pem');

module.exports = {
	logs,
	logsOld,
	secret,
	build,
	index,
	sslCert,
	sslKey,
};
