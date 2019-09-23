'use strict';

// TODO: use coordinates
import {Coordinate} from './Coordinate.js';

const STARTING_SIZE = 6;
const GROW_RATE = 6;

export class Snake {
  constructor(startX, startY) {
    Object.defineProperty(this, 'direction', {value: 'none', writable: true});
    Object.defineProperty(this, 'bodySegment', {value: []});
    for (let i = 0; i < STARTING_SIZE; i++) {
      this.bodySegment.push({x: startX, y: startY});
    }
    Object.seal(this);
  }

  /**
   * Removes the last body-segment and adds a new body-segment in the direction that the snake is going. Previously, had
   * it moving each bodySegment-segment individually.
   */
  move() {
    this.bodySegment.pop();
    if (this.direction === 'left') {
      this.bodySegment.unshift({x: this.bodySegment[0].x - 1, y: this.bodySegment[0].y});
    } else if (this.direction === 'up') {
      this.bodySegment.unshift({x: this.bodySegment[0].x, y: this.bodySegment[0].y - 1});
    } else if (this.direction === 'right') {
      this.bodySegment.unshift({x: this.bodySegment[0].x + 1, y: this.bodySegment[0].y});
    } else if (this.direction === 'down') {
      this.bodySegment.unshift({x: this.bodySegment[0].x, y: this.bodySegment[0].y + 1});
    }
  }

  grow() {
    for (let i = 0; i < GROW_RATE; i++) {
      this.bodySegment.push(
        {x: this.bodySegment[this.bodySegment.length - 1].x, y: this.bodySegment[this.bodySegment.length - 1].y}
      );
    }
  }

  checkCollison(gridSize) {
    // Checks if the snake hit itself.
    for (let i = 1; i < this.bodySegment.length; i++) {
      if (this.bodySegment[0].x === this.bodySegment[i].x && this.bodySegment[0].y === this.bodySegment[i].y) {
        return true;
      }
    }
    // Checks if the snake hit a wall.
    return this.bodySegment[0].x < 0
      || this.bodySegment[0].y < 0
      || this.bodySegment[0].x >= gridSize
      || this.bodySegment[0].y >= gridSize;
  }

  checkFruitEaten(pellet) {
    return this.bodySegment[0].x === pellet.x && this.bodySegment[0].y === pellet.y;
  }
}
