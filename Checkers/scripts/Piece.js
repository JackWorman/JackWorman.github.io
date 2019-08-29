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
      Object.defineProperty(this, 'player', {value: player, configurable: false, writable: false});
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
    const calculateMove = function(pieces, moves, col, row) {
      if (is2DArrayDefined(pieces, col, row) && pieces[col][row] === 'empty') {
        moves.push({col: col, row: row, jumps: []});
      }
      return moves;
    }
    let moves = [];
    if (this.player === PLAYER_1 || this.isKing) {
      moves = calculateMove(pieces, moves, this.col - 1, this.row - 1);
      moves = calculateMove(pieces, moves, this.col + 1, this.row - 1);
    }
    if (this.player === PLAYER_2 || this.isKing) {
      moves = calculateMove(pieces, moves, this.col - 1, this.row + 1);
      moves = calculateMove(pieces, moves, this.col + 1, this.row + 1);
    }
    moves = moves.concat(this.calculateJumps(pieces, this.col, this.row, []));
    return moves;
  }

  calculateJumps(pieces, col, row, jumps) {
    const calculateJump = function(pieces, col, row, dCol, dRow, moves, jumps, piece) {
      for (const jump of jumps) {
        if (jump.col === col + dCol && jump.row === row + dRow) {
          return moves;
        }
      }
      if (is2DArrayDefined(pieces, col + dCol * 2, row + dRow * 2)
        && ((piece.player === PLAYER_1 && pieces[col + dCol][row + dRow].player === PLAYER_2) || (piece.player === PLAYER_2 && pieces[col + dCol][row + dRow].player === PLAYER_1))
        && pieces[col + dCol * 2][row + dRow * 2] === 'empty') {
        const jumpsCopy = jumps.slice(0);
        jumpsCopy.push({col: col + dCol, row: row + dRow});
        moves.push({col: col + dCol * 2, row: row + dRow * 2, jumps: jumpsCopy});
        moves = moves.concat(piece.calculateJumps(pieces, col + dCol * 2, row + dRow * 2, jumpsCopy));
      }
      return moves;
    }
    let moves = [];
    if (this.player === PLAYER_1 || this.isKing) {
      moves = calculateJump(pieces, col, row, -1, -1, moves, jumps, this);
      moves = calculateJump(pieces, col, row, 1, -1, moves, jumps, this);
    }
    if (this.player === PLAYER_2 || this.isKing) {
      moves = calculateJump(pieces, col, row, -1, 1, moves, jumps, this);
      moves = calculateJump(pieces, col, row, 1, 1, moves, jumps, this);
    }
    return moves;
  }

  render() {
    CONTEXT_PIECES.beginPath();
    CONTEXT_PIECES.arc(
      (this.col + 0.5) * Piece.squareSize,
      (this.row + 0.5) * Piece.squareSize,
      0.85 * Piece.squareSize / 2,
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
    CONTEXT_PIECES.fill();
    CONTEXT_PIECES.lineWidth = 3;
    CONTEXT_PIECES.strokeStyle = OUTLINE_COLOR;
    CONTEXT_PIECES.stroke();
    if (this.isKing) {
      let centerX = (this.col + 0.5) * Piece.squareSize;
      let centerY = (this.row + 0.5) * Piece.squareSize;
      let x = 20;
      let y = 20;
      CONTEXT_PIECES.beginPath();
      CONTEXT_PIECES.moveTo(centerX - x, centerY - y);
      CONTEXT_PIECES.lineTo(centerX - 0.5 * x, centerY);
      CONTEXT_PIECES.lineTo(centerX, centerY - y);
      CONTEXT_PIECES.lineTo(centerX + 0.5 * x, centerY);
      CONTEXT_PIECES.lineTo(centerX + x, centerY - y);
      CONTEXT_PIECES.lineTo(centerX + x, centerY + y);
      CONTEXT_PIECES.lineTo(centerX - x, centerY + y);
      CONTEXT_PIECES.lineTo(centerX - x, centerY - y);
      CONTEXT_PIECES.closePath();
      CONTEXT_PIECES.lineWidth = 3;
      CONTEXT_PIECES.strokeStyle = 'rgb(255, 215, 0)';
      CONTEXT_PIECES.stroke();
    }
  }
}

function is2DArrayDefined(array, i, j) {
  return typeof array[i] !== 'undefined' && typeof array[i][j] !== 'undefined';
}
