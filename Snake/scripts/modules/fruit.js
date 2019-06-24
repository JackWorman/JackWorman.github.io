class Fruit {
  constructor() {
    this.placeFruit();
  }

  placeFruit() {
    do {
      var fruitX = Math.floor(Math.random() * GRID_SIZE);
      var fruitY = Math.floor(Math.random() * GRID_SIZE);
      var collison = false;
      for (var i = 0; i < snake.body.length; i++) {
        if (fruitX === snake.body[i].x && fruitY === snake.body[i].y) {
          collison = true;
        }
      }
    } while (collison);
    fruit = new Point(fruitX, fruitY);
    // Reset distance variables.
    distanceTraveled = 0;
    smallestDistancePossible = Math.abs(fruit.x - snake.body[0].x) + Math.abs(fruit.y - snake.body[0].y);
  }
}
