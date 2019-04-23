const {from} = require('rxjs');
const https = require('https');
const axios = require('axios');
const fs = require('fs');


/*
 * POST
 */
function startChallenge(ponyName, width, height, difficulty) {
    var agent = new https.Agent({ca: fs.readFileSync("C:\\Program Files\\Java\\jdk1.8.0_172\\jre\\lib\\security\\cacerts")});

    const options = {
        hostname: "https://ponychallenge.trustpilot.com",
        path: "https://ponychallenge.trustpilot.com/pony-challenge/maze",
        method: 'POST',
        agent: agent
    };

    const mazeSettings = {
        "maze-width": width,
        "maze-height": height,
        "maze-player-name": ponyName,
        "difficulty": difficulty
    };

    const promise = axios.post("https://ponychallenge.trustpilot.com/pony-challenge/maze", mazeSettings, options);
    return from(promise);
}

/*
 * GET
 */
function getChallengeData(mazeId) {
    const promise = axios.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId);
    return from(promise);
}

/*
 * POST
 */
function movePony(mazeId, direction) {
    const promise = axios.post("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId, {
        "direction": direction
    });
    return from(promise);
}

/*
 * GET
 */
function printMaze(mazeId) {
    const promise = https.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId + "/print");
    return from(promise);
}

module.exports.startChallenge = startChallenge;
module.exports.getChallengeData = getChallengeData;
module.exports.movePony = movePony;
module.exports.printMaze = printMaze;