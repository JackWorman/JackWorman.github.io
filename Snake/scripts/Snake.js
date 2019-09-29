'use strict';

// TODO: use coordinates
import {Coordinate} from './Coordinate.js';

const STARTING_SIZE = 6;
const GROW_RATE = 6;

export class Snake {
  constructor(startX, startY) {
    Object.defineProperty(this, 'direction', {value: 'none', writable: true});
    Object.defineProperty(this, 'bodySegments', {value: []});
    for (let i = 0; i < STARTING_SIZE; i++) {
      // this.bodySegments.push({x: startX, y: startY});
      this.bodySegments.push(new Coordinate(startX, startY));
    }
    Object.seal(this);
  }

  /**
   * Removes the last body-segment and adds a new body-segment in the direction that the snake is going. Previously, had
   * it moving each bodySegments-segment individually.
   */
  move() {
    console.log(this.bodySegments);
    this.bodySegments.pop();
    console.log(this.bodySegments);
    console.log(this.direction);
    if (this.direction === 'left') {
      // this.bodySegments.unshift({x: this.bodySegments[0].x - 1, y: this.bodySegments[0].y});
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x - 1, this.bodySegments[0].y));
    } else if (this.direction === 'up') {
      // this.bodySegments.unshift({x: this.bodySegments[0].x, y: this.bodySegments[0].y - 1});
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x, this.bodySegments[0].y - 1));
    } else if (this.direction === 'right') {
      // this.bodySegments.unshift({x: this.bodySegments[0].x + 1, y: this.bodySegments[0].y});
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x + 1, this.bodySegments[0].y));
    } else if (this.direction === 'down') {
      // this.bodySegments.unshift({x: this.bodySegments[0].x, y: this.bodySegments[0].y + 1});
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x, this.bodySegments[0].y + 1));
    }
    console.log(this.bodySegments);
  }

  grow() {
    for (let i = 0; i < GROW_RATE; i++) {
      // this.bodySegments.push(
      //   {x: this.bodySegments[this.bodySegments.length - 1].x, y: this.bodySegments[this.bodySegments.length - 1].y}
      // );
      this.bodySegments.push(new Coordinate(
        this.bodySegments[this.bodySegments.length - 1].x, this.bodySegments[this.bodySegments.length - 1].y
      ));
    }
  }

  checkCollison(gridSize) {
    // Checks if the snake hit itself.
    for (let i = 1; i < this.bodySegments.length; i++) {
      if (this.bodySegments[0].x === this.bodySegments[i].x && this.bodySegments[0].y === this.bodySegments[i].y) {
        return true;
      }
    }
    // Checks if the snake hit a wall.
    return this.bodySegments[0].x < 0
      || this.bodySegments[0].y < 0
      || this.bodySegments[0].x >= gridSize
      || this.bodySegments[0].y >= gridSize;
  }

  checkFruitEaten(pellet) {
    return this.bodySegments[0].x === pellet.x && this.bodySegments[0].y === pellet.y;
  }

  reset(startX, startY) {
    this.direction = 'none';
    while (this.bodySegments.length > 0) {
      this.bodySegments.pop();
    }
    for (let i = 0; i < STARTING_SIZE; i++) {
      this.bodySegments.push({x: startX, y: startY});
    }
  }
}
