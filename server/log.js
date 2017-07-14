'use strict';

/**
	* @description Функция логирования различных данных. Может выводить сообщение в консоль и сохранять его в подходящем файле.
	* @param {String} message - Сообщение.
	* @param {Object} [options] - Параметры.
	* @param {String} [options.type=unsorted] - Тип сообщения. info|warn|error
	* @param {Boolean} [options.toConsole=true] - Выводить в консоль.
	* @param {Boolean} [options.toFile=true] - Сохранять в файл.
*/
function log(message, { type = 'unsorted', toConsole = true, toFile = true } = {}) {
	let fs   = require('fs');
	let path = require('path');
	
	const FILE   = path.resolve(__dirname, `logs/${type}.log`);
	
	const RED    = '\x1b[41m\x1b[30m';
	const GREEN  = '\x1b[42m\x1b[30m';
	const YELLOW = '\x1b[43m\x1b[30m';
	const WHITE  = '\x1b[47m\x1b[30m';
	const RESET  = '\x1b[0m\x1b[0m';
	
	const COLOR = (type === 'warn')  ? YELLOW :
	              (type === 'error') ? RED : WHITE;
	
	const MESSAGE = `${new Date().toUTCString()}  |  ${message}`;
	
	
	if (toConsole) { console.log(`${COLOR}${MESSAGE}${RESET}`); }
	if (toFile) { fs.appendFile(FILE, `${MESSAGE}\r\n`, (error) => { if (error) { throw error; } }); }
}

module.exports = log;