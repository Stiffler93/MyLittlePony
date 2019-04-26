const {from} = require('rxjs');
const axios = require('axios');
const fs = require('fs');


/**
 * POST Request to start a new game.
 *
 * @param ponyName
 * @param width
 * @param height
 * @param difficulty
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function startChallenge(ponyName, width, height, difficulty) {

    const mazeSettings = {
        "maze-width": width,
        "maze-height": height,
        "maze-player-name": ponyName,
        "difficulty": difficulty
    };

    const promise = axios.post("https://ponychallenge.trustpilot.com/pony-challenge/maze", mazeSettings);
    return from(promise);
}

/**
 * GET Request to get the current game data and states.
 *
 * @param mazeId
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function getChallengeData(mazeId) {
    const promise = axios.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId);
    return from(promise);
}

/**
 * POST Request to move the pony through the maze.
 *
 * @param mazeId
 * @param direction
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function movePony(mazeId, direction) {
    const promise = axios.post("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId, {
        "direction": direction
    });
    return from(promise);
}

/**
 * GET Request to get the maze's state in printed form.
 *
 * @param mazeId
 * @returns {Observable<ObservedValueOf<ObservableInput<any>>>}
 */
function printMaze(mazeId) {
    const promise = axios.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + mazeId + "/print");
    return from(promise);
}

module.exports.startChallenge = startChallenge;
module.exports.getChallengeData = getChallengeData;
module.exports.movePony = movePony;
module.exports.printMaze = printMaze;