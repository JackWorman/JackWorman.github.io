'use strict';

const PLAYER_1 = 'player-1';
const PLAYER_2 = 'player-2';
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
    if (player === PLAYER_1 || player === PLAYER_2) {
      this.player = player;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
  }

  static initialize(canvasSize, squareSize) {
    CANVAS_PIECES.width = CANVAS_PIECES.height = canvasSize;
    Piece.squareSize = squareSize;
  }

  calculateMoves(pieces) {
    var moves = [];
    if (this.player === PLAYER_1) {
      if (pieces[this.col - 1][this.row - 1] === 'empty') {
        moves.push({col: this.col - 1, row: this.row - 1, jumps: []});
      }
      if (pieces[this.col + 1][this.row - 1] === 'empty') {
        moves.push({col: this.col + 1, row: this.row - 1, jumps: []});
      }
    } else if (this.player === PLAYER_2) {
      if (pieces[this.col - 1][this.row + 1] === 'empty') {
        moves.push({col: this.col - 1, row: this.row + 1, jumps: []});
      }
      if (pieces[this.col + 1][this.row + 1] === 'empty') {
        moves.push({col: this.col + 1, row: this.row + 1, jumps: []});
      }
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    moves.concat(this.caclulateJumps(pieces, this.col, this.row, []));
    return moves;
  }

  calculateJumps(pieces, col, row, previousJumps) {
    var moves = [];
    if (pieces[col][row].player === PLAYER_1) {
      if (pieces[col - 1][row - 1].player === PLAYER_2 && pieces[col - 2][row - 2] === 'empty') {
        var jumps = previousJumps.push({col: col - 1, row: row - 1});
        moves.push({col: col - 2, row: row - 2, jumps: jumps);
        this.calculateJumps(pieces, col - 2, row - 2, jumps);
      }
      if (pieces[col + 1][row - 1].player === PLAYER_2 && pieces[col + 2][row - 2] === 'empty') {
        var jumps = previousJumps.push({col: col + 2, row: row - 2});
        moves.push({col: col + 2, row: row - 2, jumps: jumps);
        this.calculateJumps(pieces, col + 2, row - 2, jumps);
      }
    } else if (pieces[col][row].player === PLAYER_2) {
      if (pieces[col - 1][row + 1].player === PLAYER_2 && pieces[col - 2][row + 2] === 'empty') {
        var jumps = previousJumps.push({col: col - 1, row: row + 1});
        moves.push({col: col - 2, row: row + 2, jumps: jumps);
        this.calculateJumps(pieces, col - 2, row + 2, jumps);
      }
      if (pieces[col + 1][row + 1].player === PLAYER_2 && pieces[col + 2][row + 2] === 'empty') {
        var jumps = previousJumps.push({col: col + 2, row: row + 2});
        moves.push({col: col + 2, row: row + 2, jumps: jumps);
        this.calculateJumps(pieces, col + 2, row + 2, jumps);
      }
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    return moves;
  }

  render() {
    CONTEXT_PIECES.beginPath();
    CONTEXT_PIECES.arc(
      (this.col + 0.5) * Piece.squareSize,
      (this.row + 0.5) * Piece.squareSize,
      Piece.squareSize / 2 * 0.85,
      0,
      2 * Math.PI,
      false
    );
    CONTEXT_PIECES.closePath();
    if (this.player === PLAYER_1) {
      CONTEXT_PIECES.fillStyle = PLAYER_1_COLOR;
    } else if (this.player === PLAYER_2) {
      CONTEXT_PIECES.fillStyle = PLAYER_2_COLOR;
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    CONTEXT_PIECES.lineWidth = 5;
    CONTEXT_PIECES.strokeStyle = OUTLINE_COLOR;
    CONTEXT_PIECES.stroke();
    CONTEXT_PIECES.fill();
  }
}
