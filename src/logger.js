const fs = require('fs');
const util = require('util');
const logFile = './pony.log';

let fileCleaned = false;

function log(text) {
	cleanFile();
	fs.appendFile(logFile, text + '\r\n', 'utf8', err => {});
}

function logResponse(response) {
	const obj = Object.assign({}, response.status, response.statusText, response.data);
    log(util.inspect(obj));
}

function logError(title, error) {
	log(title);
    log(util.inspect(error));
}

function cleanFile() {
    if(!fileCleaned) {
        fileCleaned = true;
        if(fs.existsSync(logFile)) fs.writeFileSync(logFile, '');
    }
}

module.exports.log = log;
module.exports.logResponse = logResponse;
module.exports.logError = logError;