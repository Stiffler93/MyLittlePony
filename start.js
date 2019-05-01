const ponyAPI = require('./src/ponyAPI');
const logger = require('./src/logger');
const utils = require('./src/utils');
const PonyAI = require('./src/ponyAI').PonyAI;
const manual = require('./src/manual');

let ponyName = "Pinkie Pie";
let mazeWidth = 15;
let mazeHeight = 15;
let difficulty = 5;
let manualMode = false;

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

    process.argv.forEach(function (value, index) {
        if (index >= 2) processArgument(value);
    });

    let mazeId;

    logger.log('Start new Game.');
    ponyAPI.startChallenge(ponyName, mazeWidth, mazeHeight, difficulty)
        .subscribe(response => {
            logger.logResponse(response);
            mazeId = response.data.maze_id;
            logger.log('Maze Id: ' + mazeId);
            utils.updateScreen(mazeId, ponyName, '');

            if (manualMode) {
                manual.startManualGame(mazeId, ponyName);
            } else {
                const ponyAI = new PonyAI(mazeId, ponyName);
                ponyAI.start();
            }
        }, error => {
            logger.logError('Error on starting a new game:', error);
            utils.print(error.response.data);
            process.exit(1);
        });
}

function processArgument(parameter) {
    logger.log('process Argument: ' + parameter);
    const [argument, value] = parameter.split('=');

    switch (argument) {
        case '--manual':
            manualMode = true;
            break;
        case '--ponyName':
            ponyName = value;
            break;
        case '--width':
            if (isNaN(value)) {
                utils.print('Wrong --width argument: Not a Number!');
                process.exit(1);
            }
            mazeWidth = parseInt(value);
            break;
        case '--height':
            if (isNaN(value)) {
                utils.print('Wrong --height argument: Not a Number!');
                process.exit(1);
            }
            mazeHeight = parseInt(value);
            break;
        case '--difficulty':
            if (isNaN(value)) {
                utils.print('Wrong --difficulty argument: Not a Number!');
                process.exit(1);
            }
            difficulty = parseInt(value);
            break;
        default:
            utils.usage();
    }
}

main();
