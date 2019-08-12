'use strict';

const PLAYER_1 = 'one';
const PLAYER_2 = 'two';
const PLAYER_1_COLOR = 'rgb(255, 255, 255)';
const PLAYER_2_COLOR = 'rgb(255, 0, 0)';
const OUTLINE_COLOR = 'rgb(0, 0, 0)';

export default class Piece {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    if (player === PLAYER_1 || player === PLAYER_2) {
      this.player = player;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
  }

  render(context, squareSize) {
    context.beginPath();
    context.arc((this.x + 0.5) * squareSize, (this.y + 0.5) * squareSize, squareSize / 2 * 0.9, 0, 2 * Math.PI, false);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = OUTLINE_COLOR;
    context.stroke();
    if (this.player === PLAYER_1) {
      context.fillStyle = PLAYER_1_COLOR;
    } else if (this.player === PLAYER_2) {
      context.fillStyle = PLAYER_2_COLOR;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    context.fill();
  }
}
