const ponyAPI = require('./src/ponyAPI');
const logger = require('./src/logger');
const utils = require('./src/utils');
const PonyAI = require('./src/ponyAI').PonyAI;

const ponyName = "Pinkie Pie";
const mazeWidth = 15;
const mazeHeight = 15;
const difficulty = 0;

function main() {
    let mazeId;
    if (process.argv.length > 3) {
        usage();
    }

    logger.log('Start new Game.');
    ponyAPI.startChallenge(ponyName, mazeWidth, mazeHeight, difficulty)
        .subscribe(response => {
            logger.logResponse(response);
            logger.log('Maze ID:');
            mazeId = response.data.maze_id;
            logger.log('Maze Id: ' + mazeId);
            utils.updateScreen(mazeId, ponyName, '');

            if (process.argv.length === 3) {
                process.argv[2] === '--manual' ? startManualGame(mazeId) : usage();
            } else {
                const ponyAI = new PonyAI(mazeId, ponyName);
                ponyAI.start();
            }
        }, error => {
            logger.logError('Error on moving Pony:', error);
            process.exit(1);
        });
}

function startManualGame(mazeId) {
    logger.log('Start Manual Game with ID: ' + mazeId);

    utils.print('');
    utils.print('-----------------------------');
    utils.print('Move the Pony: a -> west, s -> south, d -> east, w -> north');

    const stdin = process.openStdin();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {

        if (key === '\u0003') process.exit();
        else if (['a', 's', 'd', 'w'].indexOf(key) >= 0) move(mazeId, key);
    });
}

function move(mazeId, key) {
    const direction = key === 'a' ? 'west' : key === 's' ? 'south' : key === 'd' ? 'east' : 'north';
    logger.log('Move: ' + direction);
    ponyAPI.movePony(mazeId, direction)
        .subscribe(response => {
            logger.logResponse(response);
            utils.updateScreen(mazeId, ponyName, direction, () => utils.checkStatus(response));
        }, error => {
            logger.logError('Error on moving Pony:', error);
            process.exit(1);
        });
}

function usage() {
    utils.print('Usage: node start.js [--manual]\n');
    process.exit();
}

main();
