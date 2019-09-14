'use strict'

export default class Fruit {
  constructor() {
    this.x = -1;
    this.y = -1;
  }

  placeFruit(gridSize, snake) {
    do {
      let fruitX = Math.floor(Math.random() * gridSize);
      let fruitY = Math.floor(Math.random() * gridSize);
      let collison = false;
      for (const part of body) {
        if (fruitX === part.x && fruitY === part.y) {
          collison = true;
        }
      }
      // for (let i = 0; i < snake.body.length; i++) {
      //   if (fruitX === snake.body[i].x && fruitY === snake.body[i].y) {
      //     collison = true;
      //   }
      // }
    } while (collison);
    this.x = fruitX
    this.y = fruitY;
  }
}
