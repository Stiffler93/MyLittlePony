const ponyAPI = require('./ponyAPI');


const ACCEPTED = 'Move accepted';
const VICTORY = 'You won. Game ended';
const INVALID = 'Can\'t walk in there';
const KILLED = 'You lost. Killed by monster';

function checkStatus(response) {
    const stateResult = response.data['state-result'];

    switch(stateResult) {
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

function print(text) {
    process.stdout.write(text + '\n');
}

module.exports.checkStatus = checkStatus;
module.exports.updateScreen = updateScreen;
module.exports.print = print;