'use strict';

import {Coordinate} from './Coordinate.js';

export class Pellet extends Coordinate {
  constructor() {
    super(-1, -1);
    Object.seal(this);
  }

  placePellet(gridSize, snake) {
    let collison;
    do {
      this.x = Math.floor(Math.random() * gridSize);
      this.y = Math.floor(Math.random() * gridSize);
      collison = false;
      for (const part of snake.bodySegment) {
        if (this.x === part.x && this.y === part.y) {
          collison = true;
        }
      }
    } while (collison);
  }
}
