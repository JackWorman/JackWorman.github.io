'use strict';

// TODO: use coordinates
import {Coordinate} from './Coordinate.js';

export class Pellet extends Coordinate {
  constructor() {
    // super(-1, -1);
    Object.defineProperty(this, 'x', {value: -1, writable: true});
    Object.defineProperty(this, 'y', {value: -1, writable: true});
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
