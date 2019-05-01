const ponyAPI = require('./ponyAPI');
const logger = require('./logger');
const utils = require('./utils');

/**
 * Starts a manual game where the player can itself take control of the pony by using the
 * keys 'a', 's', 'd' and 'w'.
 *
 * @param mazeId
 */
function startManualGame(mazeId, ponyName) {
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
        else if (['a', 's', 'd', 'w'].indexOf(key) >= 0) move(mazeId, key, ponyName);
    });
}

/**
 * Move the pony through the maze according to the key that was pressed.
 *
 * @param mazeId
 * @param key
 */
function move(mazeId, key, ponyName) {
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

module.exports.startManualGame = startManualGame;