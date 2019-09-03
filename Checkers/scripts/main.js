'use strict';

import Board from './Board.js';
import Piece from './Piece.js';
import {PLAYER_1, PLAYER_2} from './Piece.js';

const ESCAPE_KEYCODE = 27;
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_CONTAINER = document.getElementById('canvas-container');

const board = new Board(GRID_SIZE, CANVAS_SIZE);
let pieces = [];
let mouseCoordinate = {col: 'undefined', row: 'undefined'};
let selectedCoordinate = {col: 'undefined', row: 'undefined'};
let moveCoordinates = [];
let turn = PLAYER_1;

onmousemove = function(e) {
  let rect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinate.col = Math.floor((e.clientX - rect.left) / SQUARE_SIZE);
  mouseCoordinate.row = Math.floor((e.clientY - rect.top) / SQUARE_SIZE);
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
}

CANVAS_CONTAINER.addEventListener('click', function() {
  // Checks if the selectedCoordinate were selected.
  if (selectedCoordinate.col === mouseCoordinate.col && selectedCoordinate.row === mouseCoordinate.row) {
    selectedCoordinate = {col: 'undefined', row: 'undefined'};
    moveCoordinates = [];
  } else {
    // Checks if a moveCoordinate was selected.
    for (const moveCoordinate of moveCoordinates) {
      if (moveCoordinate.col === mouseCoordinate.col && moveCoordinate.row === mouseCoordinate.row) {
        // Moves piece to the moveCoordinates.
        pieces[selectedCoordinate.col][selectedCoordinate.row].col = moveCoordinate.col;
        pieces[selectedCoordinate.col][selectedCoordinate.row].row = moveCoordinate.row;
        pieces[moveCoordinate.col][moveCoordinate.row] = pieces[selectedCoordinate.col][selectedCoordinate.row];
        pieces[selectedCoordinate.col][selectedCoordinate.row] = 'empty';
        // Checks if the piece becomes a king.
        if (moveCoordinate.row === 0 || moveCoordinate.row === GRID_SIZE - 1) {
          pieces[moveCoordinate.col][moveCoordinate.row].isKing = true;
        }
        // Removes jumped pieces.
        for (const jump of moveCoordinate.jumps) {
          pieces[jump.col][jump.row] = 'empty';
        }
        selectedCoordinate = {col: 'undefined', row: 'undefined'};
        moveCoordinates = [];
        renderPieces();
        board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
        // Check if a player won.
        let player1HasAPiece = false;
        let player2HasAPiece = false;
        for (let col = 0; col < GRID_SIZE; col++) {
          for (let row = 0; row < GRID_SIZE; row++) {
            if (pieces[col][row].player === PLAYER_1) {
              player1HasAPiece = true;
            }
            if (pieces[col][row].player === PLAYER_2) {
              player2HasAPiece = true;
            }
          }
        }
        if (!player1HasAPiece) {
          alert('Player 2 wins!');
        } else if (!player2HasAPiece) {
          alert('Player 1 wins!');
        }
        // Change the turn.
        if (turn === PLAYER_1) {
          turn = PLAYER_2;
        } else if (turn === PLAYER_2) {
          turn = PLAYER_1;
        }
        return;
      }
    }
    // Check if a piece was selected.
    selectedCoordinate = {col: mouseCoordinate.col, row:  mouseCoordinate.row};
    if (pieces[selectedCoordinate.col][selectedCoordinate.row] !== 'empty'
      && pieces[selectedCoordinate.col][selectedCoordinate.row].player === turn) {
      moveCoordinates = pieces[selectedCoordinate.col][selectedCoordinate.row].calculateMoves(pieces);
    } else {
      moveCoordinates = [];
    }
  }
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
});

onkeyup = function(e) {
  if (e.keyCode === ESCAPE_KEYCODE) {
    selectedCoordinate = {col: 'undefined', row: 'undefined'};
    moveCoordinates = [];
    board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
  }
}

const initializeGame = (function() {
  CANVAS_CONTAINER.style.width = CANVAS_CONTAINER.style.height = (CANVAS_SIZE + 2) + 'px';
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
  Piece.initialize(CANVAS_SIZE, SQUARE_SIZE);
  for (let col = 0; col < GRID_SIZE; col++) {
    pieces.push([]);
    for (let row = 0; row < GRID_SIZE; row++) {
      pieces[col].push('empty');
    }
  }
  // Creates player-1's pieces.
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = GRID_SIZE - 3; row < GRID_SIZE; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        pieces[col][row] = new Piece(col, row, PLAYER_1);
      }
    }
  }
  // Creates player-2's pieces.
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < 3; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        pieces[col][row] = new Piece(col, row, PLAYER_2);
      }
    }
  }
  renderPieces();
})();

function renderPieces() {
  Piece.clearCanvas();
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (pieces[col][row] !== 'empty') {
        pieces[col][row].render();
      }
    }
  }
}
