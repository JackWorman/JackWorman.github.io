'use strict';

// DOM elements
const CANVAS_PIECES = document.getElementById('canvas-pieces');
const CONTEXT_PIECES = CANVAS_PIECES.getContext('2d');
// Colors
const PLAYER_1_COLOR = 'rgb(255, 255, 255)';
const PLAYER_2_COLOR = 'rgb(255, 0, 0)';
const OUTLINE_COLOR = 'rgb(0, 0, 0)';

export default class Piece {
  constructor(col, row, player) {
    this.col = col;
    this.row = row;
    if (player === Piece.player1 || player === Piece.player2) {
      this.player = player;
    } else {
      throw 'Error: The property \'player\' may only be \'' + Piece.player1 + '\' or \'' + Piece.player2 + '\'.';
    }
  }

  static initialize(canvasSize, squareSize) {
    CANVAS_PIECES.width = CANVAS_PIECES.height = canvasSize;
    Piece.squareSize = squareSize;
    Piece.player1 = 'player-1';
    Piece.player2 = 'player-2';
  }

  render() {
    CONTEXT_PIECES.beginPath();
    CONTEXT_PIECES.arc(
      (this.col + 0.5) * Piece.squareSize,
      (this.row + 0.5) * Piece.squareSize,
      Piece.squareSize / 2 * 0.9,
      0,
      2 * Math.PI,
      false
    );
    CONTEXT_PIECES.closePath();
    CONTEXT_PIECES.lineWidth = 5;
    CONTEXT_PIECES.strokeStyle = OUTLINE_COLOR;
    CONTEXT_PIECES.stroke();
    if (this.player === Piece.player1) {
      CONTEXT_PIECES.fillStyle = PLAYER_1_COLOR;
    } else if (this.player === Piece.player2) {
      CONTEXT_PIECES.fillStyle = PLAYER_2_COLOR;
    } else {
      throw 'Error: The property \'player\' may only be \'' + Piece.player1 + '\' or \'' + Piece.player2 + '\'.';
    }
    CONTEXT_PIECES.fill();
  }
}
