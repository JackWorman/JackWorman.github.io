'use strict'

export default class Fruit {
  constructor() {
    this.x = -1;
    this.y = -1;
  }

  placeFruit(gridSize, snake) {
    do {
      var fruitX = Math.floor(Math.random() * gridSize);
      var fruitY = Math.floor(Math.random() * gridSize);
      var collison = false;
      for (var i = 0; i < snake.body.length; i++) {
        if (fruitX === snake.body[i].x && fruitY === snake.body[i].y) {
          collison = true;
        }
      }
    } while (collison);
    this.x = fruitX
    this.y = fruitY;
  }
}
