const logger = require('./logger');
const utils = require('./utils');

const NORTH = 'north';
const WEST = 'west';
const SOUTH = 'south';
const EAST = 'east';

function find(maze, mazeWidth, pony, exit, domokun) {
    const orientation = [];
    orientation[exit] = {isExit: true};
    findPath(maze, mazeWidth, pony, orientation);

}

function findPath(maze, mazeWidth, position, orientation, previous) {
    const info = {};
    info.next = proceed(maze, mazeWidth, position);
    info.deadends = [];
    if (previous) info.next.push(addWayBack(position, previous, mazeWidth));

    orientation[position] = Object.assign({}, orientation[position], info);

    if (isDeadend(info, previous)) {
        reverseDirection(position, orientation);
    } else {
        info.next.filter(pos => pos.index !== previous).forEach(pos => findPath(maze, mazeWidth, pos, orientation, position));
    }
}

function reverseDirection(position, orientation, previous) {
    const info = orientation[position];

    if(info.isExit) {

    }

    if (isCrossroad(info)) {
        info.deadends.push(previous);
        if (allButOnePathAreDeadends(info)) {
            const element = info.next.filter(pos => !info.deadends.contains(pos.index));
            element.recommended = true;
            reverseDirection(element.index, orientation, position);
        }
        return;
    }

    const wayBack = info.next.filter(pos => pos !== previous)[0];
    const element = info.next.find(elem => elem.index === wayBack);
    element.recommended = true;

    reverseDirection(wayBack, orientation, position);
}

function addWayBack(position, previous, width) {
    const move = {index: previous};
    switch (position - previous) {
        case width:
            move.direction = NORTH;
            break;
        case 1:
            move.direction = WEST;
            break;
        case -1:
            move.direction = EAST;
            break;
        case -width:
            move.direction = SOUTH;
            break;
        default:
            logger.log('ERROR: Way back was not correctly evaluated. Position = ' + position + ', Previous = ' + previous + ', width = ' + width);
            utils.print('ERROR: Way back was not correctly evaluated. Position = ' + position + ', Previous = ' + previous + ', width = ' + width);
            process.exit(1);
    }
}

function isDeadend(info, previous) {
    return info.next.length === 1 && previous;
}

function isCrossroad(info) {
    return info.next.length > 2;
}

function allButOnePathAreDeadends(info) {
    return info.deadends.length === info.next.length - 1;
}

function proceed(grid, width, position) {
    const moves = [];
    if (grid[position].indexOf('north') === -1) {
        moves.push({direction: NORTH, index: position - width});
    }
    if (grid[position].indexOf('west') === -1) {
        moves.push({direction: WEST, index: position - 1});
    }
    if (grid[position + 1].indexOf('west') === -1) {
        moves.push({direction: EAST, index: position + 1});
    }
    if (grid[position + width].indexOf('north') === -1) {
        moves.push({direction: SOUTH, index: position + width});
    }

    return moves;
}

module.exports.find = find;
module.exports.proceed = proceed;
