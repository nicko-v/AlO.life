'use strict';

const fs         = require('fs');
const path       = require('path');
const onFinished = require('on-finished');
const onHeaders  = require('on-headers');
const paths      = require('../config/paths.js');


class Nestor {
	constructor(logsDir, oldLogsDir) {
		this._logsDir    = logsDir    || path.resolve(__dirname, '../logs');
		this._oldLogsDir = oldLogsDir || path.resolve(__dirname, '../logs/old');
		
		this.logHttpRequest = this.logHttpRequest.bind(this);
		
		this._createLogsDir();
	}
	
	log(message, { type = 'unsorted', date = true, toConsole = true, toFile = true } = {}) {
		const file   = path.resolve(this._logsDir, `./${type}.log`);
		
		const RED    = '\x1b[31m';
		const GREEN  = '\x1b[32m';
		const YELLOW = '\x1b[33m';
		const RESET  = '\x1b[0m\x1b[0m';
		
		const COLOR = (type.startsWith('warn'))  ? YELLOW :
		              (type.startsWith('error')) ? RED : '';
		
		if (date) { message = `${new Date().toUTCString()}  |  ${message}` }
		
		
		if (toConsole) { console.log(`${RESET}${COLOR}${message}${RESET}`); }
		if (toFile) { fs.appendFile(file, `${message}\r\n`, (error) => { if (error) { throw error; } }); }
	}
	
	logHttpRequest(req, res, next) {
		next();
		
		req._nStart = process.hrtime();
		req._nDate  = new Date().toUTCString()
		
		onHeaders(res, () => {
			res._nStart = process.hrtime();
		});
		onFinished(res, () => {
			const date      = req._nDate;
			const ip        = req.realIp || '';
			const method    = req.method || '';
			const url       = req.originalUrl || '';
			const referrer  = req.headers['referer'] || req.headers['referrer'] || 'N/A';
			const userAgent = req.headers['user-agent'] || 'N/A';
			const status    = res.statusCode || 'N/A';
			
			const start   = req._nStart || [0, 0];
			const end     = res._nStart || [0, 0];
			const diff    = (end[0] * 1000 + end[1] / 1e6) - (start[0] * 1000 + start[1] / 1e6); // ms
			const resTime = `${Math.round(diff * 100) / 100} ms`;
			
			const record  = `${[date, ip.padEnd(16), status, resTime.padEnd(10), method.padEnd(7), url.padEnd(30), referrer, userAgent].join('  |  ')}`;
			
			
			this.log(record, { type: 'access', toConsole: false, date: false });
		});
	}
	
	watch(rotSize = 1, sizeCheckInterval = 0) { // При отсутствии второго аргумента проверка будет проводиться при каждом изменении файлов в директории.
		const size = rotSize * 1e6; // Мегабайты в байты.
		const time = sizeCheckInterval * 3.6e6; // Часы в миллисекунды.
		
		if (time) {
			
			setInterval(() => {
				this._getFilesByType(this._logsDir, '.log')
					.then(files => {
						
						for (let i = 0; i < files.length; i += 1) {
							this._isSizeLimitReached(files[i], size)
								.then(file => this._rotate(file))
								.catch(error => {});
						}
						
					})
					.catch(error => this.log(error, { type: 'error' }));
			}, time);
			
		} else {
			
			fs.watch(this._logsDir, (eventType, fileName) => {
				const file = path.resolve(this._logsDir, fileName || '');
				
				if (path.extname(file) === '.log') { this._rotate(file); }
			});
			
		}
	}
	
	_createLogsDir() {
		if (!fs.existsSync(this._logsDir))    { fs.mkdirSync(this._logsDir); }
		if (!fs.existsSync(this._oldLogsDir)) { fs.mkdirSync(this._oldLogsDir); }
	}
	
	_isSizeLimitReached(file, size) {
		return new Promise( (resolve, reject) => {
			
			fs.stat(file, (error, stats) => {
				if (stats.size >= size) { resolve(file); } else { reject(); }
			});
			
		});
	}
	
	_getFilesByType(dir, extension) {
		return new Promise( (resolve, reject) => {
			
			fs.readdir(dir, (error, files) => {
				if (error) { reject(error); return; }
				resolve(files
					.filter( (fileName) => fileName.endsWith(extension) )
					.map( (fileName) => path.resolve(dir, fileName) ));
			});
			
		});
}
	
	_rotate(file) {
		const date = new Date().toISOString().replace('T', '_').replace(/:/g, '-').replace(/\.\d+?Z$/, '');
		const newFile = path.resolve(this._oldLogsDir, `${path.parse(file).name}__${date}.log`);
		
		function readFile(file) {
			return new Promise((resolve, reject) => {
				
				fs.readFile(file, 'utf8', (error, content) => {
					error ? reject(error) : resolve(content);
				});
				
			});
		}
		function appendFile(file, content) {
			return new Promise((resolve, reject) => {
				
				fs.appendFile(file, content, (error) => {
					error ? reject(error) : resolve();
				});
				
			});
		}
		function truncateFile(file) {
			return new Promise((resolve, reject) => {
				
				fs.truncate(file, 0, (error) => {
					error ? reject(error) : resolve();
				});
				
			});
		}
		
		readFile(file)
			.then(content => appendFile(newFile, content))
			.then(resolve => truncateFile(file))
			.catch(error  => this.log(error, { type: 'error' }));
	}
}


module.exports = new Nestor(paths.logs, paths.logsOld);
