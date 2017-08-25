'use strict';

function validateUrl(address = '', minLength = 10, maxLength = 2000, side = 'server') {
	const ShortenerError = require('./shortenerError.js');
	
	const regexp = new RegExp('^([\\w\\-]+?\\.?)+?\\.[\\w\\-]+?$');
	
	
	if (address.length < minLength) { throw new ShortenerError('url', 'Некорректная ссылка.'); }
	if (address.length > maxLength) { throw new ShortenerError('url', `Длина ссылки не должна превышать ${maxLength} символов.`); }
	

	// Свойство hostname объекта url или элемента <a>, в зависимости от того, где используется функция,
	// содержит имя хоста без протокола, порта и пути, кодированное в punycode, что упрощает проверку:
	if (side === 'server') {
		
		var config = require('../server/config/config.js');
		var url    = require('url');
		var hname     = url.parse(address).hostname;
		var localhost = config.hostname;
		
	} else if (side === 'client') {
		
		var a = document.createElement('a');
		a.href  = address;
		var hname     = a.hostname;
		var localhost = window.location.hostname;
		
	} else { return; }
	
	
	if (hname.length < 4 ||
	    hname.length > 255 ||
	    hname.toLowerCase().indexOf(localhost) > -1 ||
	    !regexp.test(hname)) {
		throw new ShortenerError('url', 'Некорректная ссылка.');
	}
}

module.exports = validateUrl;
