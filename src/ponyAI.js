const ponyAPI = require('./ponyAPI');
const utils = require('./utils');
const logger = require('./logger');
const path2 = require('./path2');
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
        this.turns = 50;

        this.orientation = new ReplaySubject(1);


        ponyAPI.getChallengeData(this.mazeId)
            .subscribe(response => {
                this.mazeGrid = response.data.data;
                const [mazeWidth, mazeHeight] = response.data.size;
                this.endPoint = response.data['end-point'][0];

                const orientationMap = path2.find(this.mazeGrid, mazeWidth, mazeHeight, this.endPoint);
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

                const direction = orientationMap[this.pony].correct_path.direction;
                move(this.mazeId, this.ponyName, direction, () => this.start());
            }, error => {
                logger.logError('Error on getting challenge data:', error);
                process.exit(1);
            });
    }
}


function move(mazeId, ponyName, direction, callback) {
    ponyAPI.movePony(mazeId, direction)
        .subscribe(response => {
            logger.logResponse(response);
            utils.updateScreen(mazeId, ponyName, direction, () => {
                if (!utils.checkStatus(response)) {
                    logger.log('Move was not possible! Tried to go ' + direction);
                    utils.print('Move was not possible! Tried to go ' + direction);
                    process.exit(1);
                }

                if (callback) callback();
            });
        }, error => {
            logger.logError('Error on moving Pony:', error);
            process.exit(1);
        });
}

module.exports.PonyAI = PonyAI;
