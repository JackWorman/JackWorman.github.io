'use strict'

export default class Fruit {
  constructor() {
    this.x = -1;
    this.y = -1;
  }

  placeFruit(gridSize, snake) {
    do {
      this.x = Math.floor(Math.random() * gridSize);
      this.y = Math.floor(Math.random() * gridSize);
      let collison = false;
      for (const part of snake.body) {
        if (this.x === part.x && this.y === part.y) {
          collison = true;
        }
      }
      // for (let i = 0; i < snake.body.length; i++) {
      //   if (fruitX === snake.body[i].x && fruitY === snake.body[i].y) {
      //     collison = true;
      //   }
      // }
    } while (collison);
    // this.x = fruitX
    // this.y = fruitY;
  }
}
