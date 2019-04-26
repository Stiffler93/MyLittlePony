const ponyAPI = require('./ponyAPI');

const ACCEPTED = 'Move accepted';
const VICTORY = 'You won. Game ended';
const INVALID = 'Can\'t walk in there';
const KILLED = 'You lost. Killed by monster';

/**
 * This function checks the status returned after every move from the REST request. It returns true on valid
 * moves, false on invalid moves and concludes the game in case of defeat or victory.
 *
 * @param response
 * @returns {boolean}
 */
function checkStatus(response) {
    const stateResult = response.data['state-result'];

    switch (stateResult) {
        case ACCEPTED:
            return true;
        case INVALID:
            return false;

        case VICTORY:
        case KILLED:
            process.stdout.write(stateResult + '\n');
            process.exit();
    }
}

/**
 * This function is used for the visual feedback of the games' progress. It prints the maze received from
 * the pony API to the standard output.
 *
 * @param mazeId
 * @param ponyName
 * @param direction
 * @param callback
 */
function updateScreen(mazeId, ponyName, direction, callback) {
    ponyAPI.printMaze(mazeId).subscribe(response => {
        print('\033c');
        print('Game with Id: ' + mazeId);
        print('Pony: ' + ponyName);
        print('Direction: ' + direction);
        print('-----------------------------');
        print('');
        print(response.data);

        if (callback) callback();
    });
}

/**
 * This function is a helper function to print text to stdout.
 *
 * @param text
 */
function print(text) {
    process.stdout.write(text + '\n');
}

/**
 * Prints information on how to use this program to stdout.
 */
function usage() {
    print('Usage: node start.js [--manual]\n');
    process.exit();
}

module.exports.checkStatus = checkStatus;
module.exports.updateScreen = updateScreen;
module.exports.print = print;