'use strict'

const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';
const PLAYER_1 = 'one';
const PLAYER_2 = 'two';

export default class Piece {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
  }

  render(context, squareSize) {
    context.beginPath();
    context.arc(
      this.x * squareSize + squareSize / 2, // (this.x + 0.5) * squareSize
      this.y * squareSize + squareSize / 2,
      squareSize / 2 * 0.9,
      0,
      2 * Math.PI,
      false
    );
    context.closePath();
    context.strokeStyle = BLACK;
    context.stroke();
    if (this.player === PLAYER_1) {
      context.fillStyle = WHITE;
    } else if (this.player === PLAYER_2) {
      context.fillStyle = BLACK;
    } else {
      // error
    }
    context.fill();
  }
}
