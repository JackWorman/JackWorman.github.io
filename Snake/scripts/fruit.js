'use strict'

export default class Fruit {
  constructor() {
    this.x = -1;
    this.y = -1;
  }

  placeFruit(gridSize, snake) {
    let collison;
    do {
      this.x = Math.floor(Math.random() * gridSize);
      this.y = Math.floor(Math.random() * gridSize);
      collison = false;
      for (const part of snake.body) {
        if (this.x === part.x && this.y === part.y) {
          collison = true;
        }
      }
    } while (collison);
  }
}