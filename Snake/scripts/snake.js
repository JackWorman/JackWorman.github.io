'use strict'

export class Snake {
  constructor(startX, startY) {
    this.direction = 'none';
    this.body = [];
    for (let i = 0; i < 3; i++) {
      this.body.push({x: startX, y: startY});
    }
  }

  move() {
    // Move the snake from tail to head.
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = {x: this.body[i - 1].x, y: this.body[i - 1].y};
    }
    // Move the head of the snake.
    if (this.direction === 'left') {
      this.body[0] = {x: this.body[0].x - 1, y: this.body[0].y};
    } else if (this.direction === 'up') {
      this.body[0] = {x: this.body[0].x, y: this.body[0].y - 1};
    } else if (this.direction === 'right') {
      this.body[0] = {x: this.body[0].x + 1, y: this.body[0].y};
    } else if (this.direction === 'down') {
      this.body[0] = {x: this.body[0].x, y: this.body[0].y + 1};
    }
  }

  grow() {
    for (let i = 0; i < 5; i++) {
      this.body.push({x: this.body[this.body.length - 1].x, y: this.body[this.body.length - 1].y});
    }
  }

  checkCollison(gridSize) {
    // Check if the snake hit its body.
    for (let i = 1; i < this.body.length; i++) {
      if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
        return true;
      }
    }
    // Check if the snake hit a wall.
    return this.body[0].x < 0 || this.body[0].y < 0 || this.body[0].x >= gridSize || this.body[0].y >= gridSize;
  }

  checkFruitEaten(fruit) {
    return this.body[0].x === fruit.x && this.body[0].y === fruit.y;
  }

  render(context) {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Render snake from head to tail.
    for (let i = snake.body.length - 1; i >= 0; i--) {
      context.fillStyle = RAINBOW[i % RAINBOW.length];
      let squareLength = CANVAS_SIZE / GRID_SIZE;
      context.fillRect(
        this.body[i].x * squareLength + 0.5,
        this.body[i].y * squareLength + 0.5,
        squareLength,
        squareLength
      );
    }
  }
}
