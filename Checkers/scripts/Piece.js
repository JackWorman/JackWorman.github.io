'use strict';

// DOM elements
const CANVAS_PIECES = document.getElementById('canvas-pieces');
const CONTEXT_PIECES = CANVAS_PIECES.getContext('2d');
// Colors
const PLAYER_1 = 'player-1';
const PLAYER_2 = 'player-2';
const PLAYER_1_COLOR = 'rgb(255, 255, 255)';
const PLAYER_2_COLOR = 'rgb(255, 0, 0)';
const OUTLINE_COLOR = 'rgb(0, 0, 0)';

export default class Piece {
  constructor(col, row, player) {
    this.col = col;
    this.row = row;
    if (player === PLAYER_1 || player === PLAYER_2) {
      this.player = player;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
  }

  static initialize(canvasSize) {
    CANVAS_PIECES.width = CANVAS_PIECES.height = canvasSize;
    console.log('initialize()' + canvasSize);
    // Piece.squareSize = 12;
  }

  render(squareSize) {
    CONTEXT_PIECES.beginPath();
    CONTEXT_PIECES.arc((this.col + 0.5) * squareSize, (this.row + 0.5) * squareSize, squareSize / 2 * 0.9, 0, 2 * Math.PI, false);
    CONTEXT_PIECES.closePath();
    CONTEXT_PIECES.lineWidth = 3;
    CONTEXT_PIECES.strokeStyle = OUTLINE_COLOR;
    CONTEXT_PIECES.stroke();
    if (this.player === PLAYER_1) {
      CONTEXT_PIECES.fillStyle = PLAYER_1_COLOR;
    } else if (this.player === PLAYER_2) {
      CONTEXT_PIECES.fillStyle = PLAYER_2_COLOR;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    CONTEXT_PIECES.fill();
    console.log('render()');
  }
}