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

  static clearCanvas() {
    CONTEXT_PIECES.clearRect(0, 0, CANVAS_PIECES.width, CANVAS_PIECES.height);
  }

  calculateMoves(pieces) {
    var moves = [];
    if (this.player === PLAYER_1) {
      if (is2DArrayDefined(pieces, this.col - 1, this.row - 1) && pieces[this.col - 1][this.row - 1] === 'empty') {
        moves.push({col: this.col - 1, row: this.row - 1, jumps: []});
      }
      if (is2DArrayDefined(pieces, this.col + 1, this.row - 1) && pieces[this.col + 1][this.row - 1] === 'empty') {
        moves.push({col: this.col + 1, row: this.row - 1, jumps: []});
      }
    } else if (this.player === PLAYER_2) {
      if (is2DArrayDefined(pieces, this.col - 1, this.row + 1) && pieces[this.col - 1][this.row + 1] === 'empty') {
        moves.push({col: this.col - 1, row: this.row + 1, jumps: []});
      }
      if (is2DArrayDefined(pieces, this.col + 1, this.row + 1) && pieces[this.col + 1][this.row + 1] === 'empty') {
        moves.push({col: this.col + 1, row: this.row + 1, jumps: []});
      }
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    console.log('========================');
    console.log('Before calculateJumps():');
    console.log(moves);
    moves = moves.concat(this.calculateJumps(pieces, this.col, this.row, []));
    console.log('After calculateJumps():');
    console.log(moves);
    console.log('========================');
    return moves;
  }

  calculateJumps(pieces, col, row, jumps) {
    var moves = [];
    if (this.player === PLAYER_1) {
      if (is2DArrayDefined(pieces, col - 2, row - 2) && pieces[col - 1][row - 1].player === PLAYER_2 && pieces[col - 2][row - 2] === 'empty') {
        jumps.push({col: col - 1, row: row - 1});
        moves.push({col: col - 2, row: row - 2, jumps: jumps});
        moves = moves.concat(this.calculateJumps(pieces, col - 2, row - 2, jumps));
      }
      if (is2DArrayDefined(pieces, col + 2, row - 2) && pieces[col + 1][row - 1].player === PLAYER_2 && pieces[col + 2][row - 2] === 'empty') {
        jumps.push({col: col + 1, row: row - 1});
        moves.push({col: col + 2, row: row - 2, jumps: jumps});
        moves = moves.concat(this.calculateJumps(pieces, col + 2, row - 2, jumps));
      }
    } else if (this.player === PLAYER_2) {
      if (is2DArrayDefined(pieces, col - 2, row + 2) && pieces[col - 1][row + 1].player === PLAYER_1 && pieces[col - 2][row + 2] === 'empty') {
        jumps.push({col: col - 1, row: row + 1});
        moves.push({col: col - 2, row: row + 2, jumps: jumps});
        moves = moves.concat(this.calculateJumps(pieces, col - 2, row + 2, jumps));
      }
      if (is2DArrayDefined(pieces, col + 2, row + 2) && pieces[col + 1][row + 1].player === PLAYER_1 && pieces[col + 2][row + 2] === 'empty') {
        jumps.push({col: col + 1, row: row + 1});
        moves.push({col: col + 2, row: row + 2, jumps: jumps});
        moves = moves.concat(this.calculateJumps(pieces, col + 2, row + 2, jumps));
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

function is2DArrayDefined(array, i, j) {
  return typeof array[i] !== 'undefined' && typeof array[i][j] !== 'undefined';
}
