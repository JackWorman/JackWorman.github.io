export default class Snake {
  constructor(startX, startY) {
    this.direction = 'none';
    this.body = [{x: startX, y: startY}];
  }

  move() {
    // Move the snake from tail to head.
    for (var i = this.body.length - 1; i > 0; i--) {
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
    for (var i = 0; i < 5; i++) {
      this.body.push({x: this.body[this.body.length - 1].x, y: this.body[this.body.length - 1].y});
    }
  }

  checkCollison(gridSize) {
    // Check if the snake hit its body.
    for (var i = 1; i < this.body.length; i++) {
      if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
        reset();
      }
    }
    // Check if the snake hit a wall.
    if (this.body[0].x < 0 || this.body[0].y < 0 || this.body[0].x >= gridSize || this.body[0].y >= gridSize) {
      reset();
    }
  }

  checkFruitEaten(fruit, score) {
    if (this.body[0].x === fruit.x && this.body[0].y === fruit.y) {
      // Update score.
      score += Math.ceil(snake.body.length * smallestDistancePossible / distanceTraveled * framesPerSecond);
      updateScore();
      // Increase the size of the snake.
      this.grow();
      placeFruit();
    }
  }
}
