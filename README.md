# MyLittlePony

MyLittlePony is my solution to the challenge found at [Link](https://ponychallenge.trustpilot.com/index.html).
It was implemented in NodeJs and runs in the command line.

## How to run the program

The program needs Node to be installed. When Node is installed you can run the program by typing following command
in the console:
> node start.js
It will run a game with the default settings of witdh and height being 15, difficulty equals to 0 and the pony is
called Pinkie Pie.

There are several optional arguments that can be used to configure the game:
- __--manual__: Start the manual mode where you can navigate the pony through the maze yourself.
- __--ponyName=<value>__: Set the name of the Pony. <value> must be a valid pony name.
- __--width=<value>__: Set the width of the maze. <value> must be between 15 and 25.
- __--height=<value>__: Set the height of the maze. <value> must be between 15 and 25.
- __--difficulty=<value>__: Set the difficulty of the game. <value> must be from 0 to 10.

> node start.js [--manual] [--ponyName=<value>] [--width=<value>] [--height=<value>] [--difficulty=<value>]

## What is the purpose
The purpose of this program is to safely navigate the pony to the exit of the maze without being caught by the domokun.
In default mode the game is played automatically by the Pony AI. In __manual mode__ you can navigate the pony with
following keys:
* __a__: move west
* __s__: move south
* __d__: move east
* __w__: move north

## Remarks
Depending on the difficulty though, unfortunately, it is not always possible to win the game. At level 10 the domokun
follows a direct path to find the pony and the maze is constructed in a manner that there are no cyclic connections
between the paths. Thus, at higher levels it is a matter of luck where the pony, domokun and exit are positioned
within the maze.