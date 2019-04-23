const ponyAPI = require('./src/ponyAPI');
const log = require('./src/logger').log;

const ponyName = "Pinkie Pie";
const mazeWidth = 15;
const mazeHeight = 15;
const difficulty = 0;

function main() {
    let mazeId;
    if (process.argv.length > 3) {
        console.log(process.argv.length);
        usage();
    }

    if (process.argv.length === 3) {
        mazeId = process.argv[2];
        process.stdout.write('Continue game with ID: ' + mazeId);
        updateScreen(mazeId, ponyName, '');
    } else {
        ponyAPI.startChallenge(ponyName, mazeWidth, mazeHeight, difficulty)
            .subscribe(response => {
                log('StartChallenge: ');
                log(response);
                process.stdout.write('Start new Game. Maze ID: ' + response);
                mazeId = response;
                updateScreen(mazeId, ponyName, '');
            });
    }

    const stdin = process.openStdin();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {

        if (key === '\u0003') process.exit();
        else if (['a', 's', 'd', 'w'].indexOf(key) >= 0) move(key);
    });
}

function move(mazeId, key) {
    const direction = key === 'a' ? 'west' : key === 's' ? 'south' : key === 'd' ? 'east' : 'north';
    ponyAPI.movePony(mazeId, direction);
}

function updateScreen(mazeId, ponyName, direction) {
    ponyAPI.printMaze(mazeId).subscribe(data => {
        process.stdout.write('\033c');
        process.stdout.write('Game with Id: ' + mazeId);
        process.stdout.write('Pony: ' + ponyName);
        process.stdout.write('Direction: ' + direction);
        process.stdout.write('-----------------------------');
        process.stdout.write('');
        process.stdout.write(data);
    });
}

function usage() {
    process.stdout.write('Usage: node start.js [maze-ID]\n');
    process.stdout.write('If the maze id is passed the game is continued.\n');
    process.exit();
}

main();
