const fs = require('fs');
const logFile = './ponyAPI.log'

function log(text) {
	fs.appendFile(logFile, text + '\r\n', 'utf8', err => {});
}

module.exports.log = log;