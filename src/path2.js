const logger = require('./logger');

const NORTH = 'north';
const WEST = 'west';
const SOUTH = 'south';
const EAST = 'east';

/**
 * The find function returns a map with all tiles connected to it's neighbours as well as the direct
 * path to the exit from any point within the maze.
 *
 * The evaluation starts at the point where the exit is located and recursively goes into every possible
 * direction, interconnecting the paths.
 *
 * @param maze
 * @param mazeWidth
 * @param exit
 * @returns {Array}
 */
function find(maze, mazeWidth, exit) {
    const orientationMap = [];
    findPath(maze, mazeWidth, exit, orientationMap);

    logger.log('Orientation Map assembled:');
    logger.logObject(orientationMap);

    return orientationMap;
}

/**
 * This function is recursively called to connect the paths. If a tile ends in a dead-end, the recursion stops.
 *
 * @param maze
 * @param mazeWidth
 * @param position
 * @param orientationMap
 * @param previous
 */
function findPath(maze, mazeWidth, position, orientationMap, previous) {
    const info = {};
    const paths = proceed(maze, mazeWidth, position);
    if (previous) {
        info.other_paths = paths.filter(p => p.index !== previous);
        info.correct_path = previous;

        orientationMap[position] = info;
    }

    if (isDeadEnd(info)) return;

    info.other_paths.forEach(pos => findPath(maze, mazeWidth, pos, orientationMap, position));
}

/**
 * This helper function evaluates the possible directions to go from a certain point.
 *
 * @param grid
 * @param width
 * @param position
 * @returns {Array}
 */
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

/**
 * Evaluates if a point in the maze is a dead-end. Returns true in case of a dead-end.
 *
 * @param info
 * @returns {boolean}
 */
function isDeadEnd(info) {
    return info.other_paths.length === 0;
}

module.exports.find = find;