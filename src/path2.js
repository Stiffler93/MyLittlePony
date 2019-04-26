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
 * @param mazeHeight
 * @param exit
 * @returns {Array}
 */
function find(maze, mazeWidth, mazeHeight, exit) {
    const orientationMap = [];
    findPath(maze, mazeWidth, mazeHeight, exit, orientationMap);

    logger.log('Orientation Map assembled:');

    return orientationMap;
}

/**
 * This function is recursively called to connect the paths. If a tile ends in a dead-end, the recursion stops.
 *
 * @param maze
 * @param mazeWidth
 * @param mazeHeight
 * @param position
 * @param orientationMap
 * @param previous
 */
function findPath(maze, mazeWidth, mazeHeight, position, orientationMap, previous) {
    const info = {};
    const paths = proceed(maze, mazeWidth, mazeHeight, position).filter(p => p.index !== previous);
    if (previous) {
        info.other_paths = paths;
        const direction = previous < position ? (previous + 1 === position ? WEST : NORTH) : (previous - 1 === position ? EAST : SOUTH);
        info.correct_path = {direction: direction, index: previous};

        orientationMap[position] = info;
    }

    if (isDeadEnd(info)) return;

    paths.forEach(pos => findPath(maze, mazeWidth, mazeHeight, pos.index, orientationMap, position));
}

/**
 * This helper function evaluates the possible directions to go from a certain point.
 *
 * @param grid
 * @param width
 * @param height
 * @param position
 * @returns {Array}
 */
function proceed(grid, width, height, position) {
    const moves = [];

    if (grid[position].indexOf('north') === -1) {
        moves.push({direction: NORTH, index: position - width});
    }

    if (grid[position].indexOf('west') === -1) {
        moves.push({direction: WEST, index: position - 1});
    }

    const isFurthestRightColumn = position % width === 14;
    if (!isFurthestRightColumn && grid[position + 1].indexOf('west') === -1) {
        moves.push({direction: EAST, index: position + 1});
    }

    const isLastRow = Math.floor(position / height) === height - 1;
    if (!isLastRow && grid[position + width].indexOf('north') === -1) {
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
    return info.other_paths && info.other_paths.length === 0;
}

module.exports.find = find;