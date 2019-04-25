const ponyAPI = require('./ponyAPI');
const utils = require('./utils');
const logger = require('./logger');

const NORTH = 'north';
const WEST = 'west';
const SOUTH = 'south';
const EAST = 'east';

class PonyAI {

    constructor(mazeId, ponyName) {
        this.mazeId = mazeId;
        this.ponyName = ponyName;
        this.turns = 20;
    }

    start() {
        if(this.turns-- === 0) {
            logger.log('Turns used up. Pony is lost.');
            utils.print('Turns used up. Pony is lost.');
            process.exit(0);
        }
        ponyAPI.getChallengeData(this.mazeId)
            .subscribe(response => {
                logger.log('got challenge data');
                logger.logResponse(response);
                this.mazeGrid = response.data.data;
                [this.mazeWidth, this.mazeHeight] = response.data.size;
                this.domokun = response.data.domokun[0];
                this.pony = response.data.pony[0];
                this.endPoint = response.data['end-point'][0];

                const directions = findPath(this.mazeGrid, this.mazeWidth, this.pony);
                move(this.mazeId, this.ponyName, directions[0], () => this.start());
            }, error => {
                logger.logError('Error on getting challenge data:', error);
                process.exit(1);
            });
    }
}

function move(mazeId, ponyName, direction, callback) {
    logger.log('Move: ' + direction);
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

function findPath(grid, width, position) {
    const directions = [];
    if (grid[position].indexOf('north') === -1) {
        directions.push(NORTH);
    }
    if (grid[position].indexOf('west') === -1) {
        directions.push(WEST);
    }
    if (grid[position + 1].indexOf('west') === -1) {
        directions.push(EAST);
    }
    if (grid[position + width].indexOf('north') === -1) {
        directions.push(SOUTH);
    }

    return directions;
}

module.exports.PonyAI = PonyAI;
