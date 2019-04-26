const fs = require('fs');
const util = require('util');
const logFile = './pony.log';

let fileCleaned = false;

function log(text) {
	cleanFile();
	fs.appendFileSync(logFile, text + '\r\n');
}

function logObject(obj) {
    log(util.inspect(obj));
}

function logResponse(response) {
	const obj = Object.assign({}, response.status, response.statusText, response.data);
    log(util.inspect(obj));
}

function logError(title, error) {
	log(title);
    log(util.inspect(error));
}

function logOrientationMap(orientationMap) {
    log('Orientation map:');
    for (let i = 0; i < 225; i++) {
        log('[' + i + ']');
        logObject(orientationMap[i]);
    }
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
module.exports.logObject = logObject;
module.exports.logOrientationMap = logOrientationMap;