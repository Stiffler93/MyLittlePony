const ponyAPI = require('./ponyAPI');
const utils = require('./utils');
const logger = require('./logger');
const path = require('./path');
const {combineLatest, ReplaySubject} = require('rxjs');

/**
 * The PonyAI takes care of navigating the pony through the maze.
 *
 * For every round in the game, the challenge data is requested from the pony API. It is evaluated what
 * may be a good next move regarding the pony's, the Domokun's and the exit's position.
 */
class PonyAI {

    constructor(mazeId, ponyName) {
        this.mazeId = mazeId;
        this.ponyName = ponyName;
        this.turns = 625;

        this.orientation = new ReplaySubject(1);


        ponyAPI.getChallengeData(this.mazeId)
            .subscribe(response => {
                this.mazeGrid = response.data.data;
                [this.mazeWidth, this.mazeHeight] = response.data.size;
                this.endPoint = response.data['end-point'][0];

                const orientationMap = path.find(this.mazeGrid, this.mazeWidth, this.mazeHeight, this.endPoint);
                this.orientation.next(orientationMap);
            }, error => {
                logger.logError('Error on getting challenge data:', error);
                process.exit(1);
            });
    }

    /**
     * This function starts the Pony AI and triggers the pony's movement.
     */
    start() {
        logger.log('Start');
        if (this.turns-- === 0) {
            logger.log('Turns used up. Pony is lost.');
            utils.print('Turns used up. Pony is lost.');
            process.exit(0);
        }

        combineLatest(this.orientation, ponyAPI.getChallengeData(this.mazeId))
            .subscribe(([orientationMap, response]) => {
                this.pony = response.data.pony[0];
                this.domokun = response.data.domokun[0];

                let direction;
                const correctPath = orientationMap[this.pony].correct_path;
                if (isInDanger(correctPath.index, this.domokun, this.mazeWidth, this.mazeGrid)) {
                    direction = runAway(this.pony, this.domokun, orientationMap, this.mazeGrid);
                } else {
                    direction = orientationMap[this.pony].correct_path.direction;
                }
                move(this.mazeId, this.ponyName, direction, () => this.start());
            }, error => {
                logger.logError('Error on getting challenge data:', error);
                process.exit(1);
            });
    }
}

/**
 * Move the pony through the maze. It calls the pony API and checks the state of the game after every turn.
 *
 * @param mazeId
 * @param ponyName
 * @param direction
 * @param callback
 */
function move(mazeId, ponyName, direction, callback) {
    ponyAPI.movePony(mazeId, direction)
        .subscribe(response => {
            utils.updateScreen(mazeId, ponyName, direction, () => {
                utils.checkStatus(response);

                if (callback) callback();
            });
        }, error => {
            logger.logError('Error on moving Pony:', error);
            process.exit(1);
        });
}

/**
 * Checks if nextStep one and two are next to each other or the same in the grid. Returns true if that is the case.
 *
 * @param nextStep
 * @param domokun
 * @param width
 * @param mazeGrid
 * @returns {boolean}
 */
function isInDanger(nextStep, domokun, width, mazeGrid) {
    const isSameSpot = nextStep === domokun;
    const isNextToEachOther = nextStep - width === domokun || nextStep - 1 === domokun || nextStep + 1 === domokun
        || nextStep + width === domokun;

    return isSameSpot || (isNextToEachOther && !wallExists(nextStep, domokun, width, mazeGrid));
}

/**
 * Checks if there is a wall between position and position2. Returns true if wall exists.
 *
 * @param position
 * @param position2
 * @param width
 * @param mazeGrid
 * @returns {boolean}
 */
function wallExists(position, position2, width, mazeGrid) {
    let exists = false;
    switch (position2 - position) {
        case width:
            exists = mazeGrid[position2].indexOf('north') >= 0;
            break;
        case 1:
            exists = mazeGrid[position2].indexOf('west') >= 0;
            break;
        case -1:
            exists = mazeGrid[position].indexOf('west') >= 0;
            break;
        case -width:
            exists = mazeGrid[position].indexOf('north') >= 0;
            break;
    }
    logger.log('WallExists: ' + exists);

    return exists;
}

/**
 * Calculates the next step to get away from the domokun. If the pony reaches a dead-end, it accepts
 * its destiny to be caught.
 *
 * @param pony
 * @param domokun
 * @param orientationMap
 */
function runAway(pony, domokun, orientationMap) {
    logger.log('runAway(). pony = ' + pony + ', domokun = ' + domokun);

    const otherPaths = orientationMap[pony].other_paths;
    if (!otherPaths || otherPaths.length === 0) {
        return orientationMap[pony].correct_path.direction;
    }

    // search longest escape route
    let direction;
    let longestEscapeRoute = 0;
    for (let i = 0; i < otherPaths.length; i++) {
        const lengthEscapeRoute = calculateEscape(otherPaths[i].index, orientationMap);
        if (lengthEscapeRoute > longestEscapeRoute) {
            longestEscapeRoute = lengthEscapeRoute;
            direction = otherPaths[i].direction;
        }
    }

    return direction;
}

/**
 * Recursively searches for the longest escape route. Returns the amount of steps that can be
 * walked on that route.
 *
 * @param pony
 * @param orientationMap
 * @returns {number}
 */
function calculateEscape(pony, orientationMap) {
    const position = orientationMap[pony];
    if (!position.other_paths || position.other_paths.length === 0) {
        return 1;
    }

    if (position.other_paths.length === 1) {
        return 1 + calculateEscape(position.other_paths[0].index, orientationMap);
    }

    let longestEscapeRoute = 0;
    for (let i = 0; i < position.other_paths.length; i++) {
        const lengthEscapeRoute = calculateEscape(position.other_paths[i].index, orientationMap);
        if (lengthEscapeRoute > longestEscapeRoute) {
            longestEscapeRoute = lengthEscapeRoute;
        }
    }

    return longestEscapeRoute;
}

module.exports.PonyAI = PonyAI;
