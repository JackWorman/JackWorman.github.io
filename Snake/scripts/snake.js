class Snake {
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
      this.body.push({x: this.body[this.body.length].x, y: this.body[this.body.length].y});
    }
  }
}
