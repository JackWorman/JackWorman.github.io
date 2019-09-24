'use strict';

import {Coordinate} from './Coordinate.js';

export class Pellet extends Coordinate {
  constructor() {
    super(-1, -1);
    Object.seal(this);
  }

  /**
   * Randomly sets the coordinates of the pellet and then checks if it is in a free space. The coordinates are randomly
   * set till it is in a valid position.
   * @param  {Number} gridSize [description]
   * @param  {Snake} snake    [description]
   */
  placePellet(gridSize, snake) {
    let collison;
    do {
      this.setCoordinate(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
      collison = false;
      for (const part of snake.bodySegment) {
        if (Coordinate.compare(this, part)) {
          collison = true;
        }
      }
    } while (collison);
  }
}
