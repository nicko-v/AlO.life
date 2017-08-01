'use strict';

function validateUrl(address = '', minLength = 10, maxLength = 2000) {
	const url    = require('url');
	const config = require('../config/config.js');
	
	const regexp = new RegExp('^([\\w\\-]+?\\.?)+?\\.[\\w\\-]+?$');
	
	
	if (address.length < minLength) { throw new Error('Некорректная ссылка.'); }
	if (address.length > maxLength) { throw new Error(`Длина ссылки не должна превышать ${maxLength} символов.`); }
	
	
	// Свойство hostname объекта url содержит имя хоста без протокола, порта и пути, кодированное в punycode, что упрощает проверку:
	const hname = url.parse(address).hostname;
	
	if (hname.length < 4 ||
	    hname.length > 255 ||
	    hname.toLowerCase().indexOf(config.hostname) > -1 ||
	    !regexp.test(hname)) {
		throw new Error('Некорректная ссылка.');
	}
}

module.exports = validateUrl;
