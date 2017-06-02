module.exports = (message, type = 'unsorted') => { // info, warn, error
	let fs   = require('fs');
	let path = require('path');
	
	const FILE = path.resolve(__dirname, `logs/${type}.log`);
	
	console.log(`[${new Date().toUTCString()}]  -::-  ${message}`);
	fs.appendFile(FILE, `[${new Date().toUTCString()}]  -::-  ${message}\r\n\r\n`, function (error) {
		if (error) { throw error; }
	});
};