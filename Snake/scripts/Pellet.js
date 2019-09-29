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
   * @param  {number} gridSize The length\width of the grid.
   * @param  {Snake} snake    [description]
   */
  placePellet(gridSize, snakeBodySegments) {
    let collison;
    do {
      this.setCoordinate(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
      collison = false;
      for (const snakeBodySegment of snakeBodySegments) {
        if (Coordinate.compare(this, snakeBodySegment)) {
          collison = true;
        }
      }
    } while (collison);
  }
}
