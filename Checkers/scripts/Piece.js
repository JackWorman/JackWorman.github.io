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
      Object.defineProperty(this, "player", { configurable: false, writable: false });
    } else {
      throw 'Error: The property \'player\' may only be \'' + PLAYER_1 + '\' or \'' + PLAYER_2 + '\'.';
    }
    this.isKing = false;
  }

  static initialize(canvasSize, squareSize) {
    CANVAS_PIECES.width = CANVAS_PIECES.height = canvasSize;
    Piece.squareSize = squareSize;
  }

  static clearCanvas() {
    CONTEXT_PIECES.clearRect(0, 0, CANVAS_PIECES.width, CANVAS_PIECES.height);
  }

  calculateMoves(pieces) {
    const func = function(pieces, moves, col, row) { // TODO: rename to be more descriptive
      if (is2DArrayDefined(pieces, col, row) && pieces[col][row] === 'empty') {
        moves.push({col: col, row: row, jumps: []});
      }
      return moves;
    }
    let moves = [];
    if (this.player === PLAYER_1 || this.isKing) {
      moves = func(pieces, moves, this.col - 1, this.row - 1);
      moves = func(pieces, moves, this.col + 1, this.row - 1);
    }
    if (this.player === PLAYER_2 || this.isKing) {
      moves = func(pieces, moves, this.col - 1, this.row + 1);
      moves = func(pieces, moves, this.col + 1, this.row + 1);
    }
    moves = moves.concat(this.calculateJumps(pieces, this.col, this.row, []));
    return moves;
  }

  calculateJumps(pieces, col, row, jumps) {
    const func2 = function(pieces, col, row, moves, jumps) {
      console.log('===========================');
      console.log(is2DArrayDefined(pieces, col - 1, row - 1));
      console.log(pieces[col][row].player === PLAYER_2);
      console.log(pieces[col - 1][row - 1] === 'empty');
      if (is2DArrayDefined(pieces, col - 1, row - 1) && pieces[col][row].player === PLAYER_2 && pieces[col - 1][row - 1] === 'empty') {
        let newJumps = jumps.slice(0);
        newJumps.push({col: col, row: row});
        moves.push({col: col - 1, row: row - 1, jumps: newJumps});
        moves = moves.concat(this.calculateJumps(pieces, col - 1, row - 1, newJumps));
      }
      return moves;
    }
    let moves = [];
    if (this.player === PLAYER_1) {
      moves = func2(pieces, col - 1, col - 1, moves, jumps);
      moves = func2(pieces, col + 1, col - 1, moves, jumps);
      // if (is2DArrayDefined(pieces, col - 2, row - 2) && pieces[col - 1][row - 1].player === PLAYER_2 && pieces[col - 2][row - 2] === 'empty') {
      //   let newJumps = jumps.slice(0);
      //   newJumps.push({col: col - 1, row: row - 1});
      //   moves.push({col: col - 2, row: row - 2, jumps: newJumps});
      //   moves = moves.concat(this.calculateJumps(pieces, col - 2, row - 2, newJumps));
      // }
      // if (is2DArrayDefined(pieces, col + 2, row - 2) && pieces[col + 1][row - 1].player === PLAYER_2 && pieces[col + 2][row - 2] === 'empty') {
      //   let newJumps = jumps.slice(0);
      //   newJumps.push({col: col + 1, row: row - 1});
      //   moves.push({col: col + 2, row: row - 2, jumps: newJumps});
      //   moves = moves.concat(this.calculateJumps(pieces, col + 2, row - 2, newJumps));
      // }
    } else if (this.player === PLAYER_2) {
      if (is2DArrayDefined(pieces, col - 2, row + 2) && pieces[col - 1][row + 1].player === PLAYER_1 && pieces[col - 2][row + 2] === 'empty') {
        let newJumps = jumps.slice(0);
        newJumps.push({col: col - 1, row: row + 1});
        moves.push({col: col - 2, row: row + 2, jumps: newJumps});
        moves = moves.concat(this.calculateJumps(pieces, col - 2, row + 2, newJumps));
      }
      if (is2DArrayDefined(pieces, col + 2, row + 2) && pieces[col + 1][row + 1].player === PLAYER_1 && pieces[col + 2][row + 2] === 'empty') {
        let newJumps = jumps.slice(0);
        newJumps.push({col: col + 1, row: row + 1});
        moves.push({col: col + 2, row: row + 2, jumps: newJumps});
        moves = moves.concat(this.calculateJumps(pieces, col + 2, row + 2, newJumps));
      }
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
