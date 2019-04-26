const ponyAPI = require('./src/ponyAPI');
const logger = require('./src/logger');
const utils = require('./src/utils');
const PonyAI = require('./src/ponyAI').PonyAI;
const manual = require('./src/manual');

const ponyName = "Pinkie Pie";
const mazeWidth = 15;
const mazeHeight = 15;
const difficulty = 0;

/**
 * The entry point to this application.
 *
 * The application can be called in manual mode or in automatic mode:
 *      MANUAL: node start.js --manual
 *   AUTOMATIC: node start.js
 *
 * In the manual mode the play can control the pony itself by navigating with following keys:
 *      'a': WEST, 's': SOUTH, 'd': EAST, 'w': NORTH
 *
 * The manual mode was used to get insights of the game play to be able to automate the pony's movement.
 *
 * The automatic mode is supposed to fulfill the requirements of the task from:
 *      https://ponychallenge.trustpilot.com/api-docs/index.html
 */
function main() {
    if (process.argv.length > 3) {
        utils.usage();
    }

    let mazeId;

    logger.log('Start new Game.');
    ponyAPI.startChallenge(ponyName, mazeWidth, mazeHeight, difficulty)
        .subscribe(response => {
            logger.logResponse(response);
            mazeId = response.data.maze_id;
            logger.log('Maze Id: ' + mazeId);
            utils.updateScreen(mazeId, ponyName, '');

            if (process.argv.length === 3) {
                process.argv[2] === '--manual' ? manual.startManualGame(mazeId) : utils.usage();
            } else {
                const ponyAI = new PonyAI(mazeId, ponyName);
                ponyAI.start();
            }
        }, error => {
            logger.logError('Error on starting a new game:', error);
            process.exit(1);
        });
}

main();
