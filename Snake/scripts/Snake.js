'use strict';

// TODO: use coordinates
import {Coordinate} from './Coordinate.js';

const STARTING_SIZE = 6;
const GROW_RATE = 6;
const SNAKE_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(148, 0, 211)",
];

export class Snake {
  constructor() {
    Object.defineProperty(this, 'direction', {value: 'none', writable: true});
    Object.defineProperty(this, 'bodySegments', {value: []});
    Object.seal(this);
  }

  /**
   * Removes the last body-segment and adds a new body-segment in the direction that the snake is going. Previously, had
   * it moving each bodySegments-segment individually.
   */
  move() {
    this.bodySegments.pop();
    if (this.direction === 'left') {
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x - 1, this.bodySegments[0].y));
    } else if (this.direction === 'up') {
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x, this.bodySegments[0].y - 1));
    } else if (this.direction === 'right') {
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x + 1, this.bodySegments[0].y));
    } else if (this.direction === 'down') {
      this.bodySegments.unshift(new Coordinate(this.bodySegments[0].x, this.bodySegments[0].y + 1));
    }
  }

  grow() {
    for (let i = 0; i < GROW_RATE; i++) {
      this.bodySegments.push(new Coordinate(
        this.bodySegments[this.bodySegments.length - 1].x, this.bodySegments[this.bodySegments.length - 1].y
      ));
    }
  }

  checkCollison(gridSize) {
    // Checks if the snake hit itself.
    for (let i = 1; i < this.bodySegments.length; i++) {
      if (Coordinate.compare(this.bodySegments[0], this.bodySegments[i])) {
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
    return Coordinate.compare(this.bodySegments[0], pellet);
  }

  reset(x, y) {
    this.direction = 'none';
    while (this.bodySegments.length > 0) {
      this.bodySegments.pop();
    }
    for (let i = 0; i < STARTING_SIZE; i++) {
      this.bodySegments.push(new Coordinate(x, y));
    }
  }

  render(fillSquare) {
    for (let i = 0; i < this.bodySegments.length; i++) {
      fillSquare(this.bodySegments[i].x, this.bodySegments[i].y, SNAKE_COLORS[i % SNAKE_COLORS.length]);
    }
  }
}
