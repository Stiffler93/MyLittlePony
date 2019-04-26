const logger = require('./logger');

const NORTH = 'north';
const WEST = 'west';
const SOUTH = 'south';
const EAST = 'east';

function find(maze, mazeWidth, exit) {
    const orientationMap = [];
    orientationMap[exit] = {isExit: true};
    findPath(maze, mazeWidth, exit, orientationMap);

    logger.log('Orientation Map assembled:');
    logger.logObject(orientationMap);

    return orientationMap;
}

function findPath(maze, mazeWidth, position, orientationMap, previous) {
    const info = {};
    const paths = proceed(maze, mazeWidth, position);
    if (previous) {
        info.other_paths = paths.filter(p => p.index !== previous);
        info.correct_path = previous;

        orientationMap[position] = Object.assign({}, orientationMap[position], info);
    }

    if (isDeadend(info)) return;

    info.other_paths.forEach(pos => findPath(maze, mazeWidth, pos, orientationMap, position));
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

function isDeadend(info) {
    return info.other_paths.length === 0;
}

module.exports.find = find;