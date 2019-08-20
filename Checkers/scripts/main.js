'use strict';

import Board from './Board.js';
import Piece from './Piece.js';

const ESCAPE_KEYCODE = 27;
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_CONTAINER = document.getElementById('canvas-container');

const board = new Board(GRID_SIZE, CANVAS_SIZE);
let pieces = [];
let mouseCoordinate = {col: -1, row: -1};
let selectedCoordinate = {col: -1, row: -1};
let moveCoordinates = [];
let turn = 'player-1';

onmousemove = function(e) {
  let rect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinate.col = Math.floor((e.clientX - rect.left) / SQUARE_SIZE);
  mouseCoordinate.row = Math.floor((e.clientY - rect.top) / SQUARE_SIZE);
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
}

CANVAS_CONTAINER.addEventListener('click', function() {
  // Checks if the selectedCoordinate were selected.
  if (selectedCoordinate.col === mouseCoordinate.col && selectedCoordinate.row === mouseCoordinate.row) {
    selectedCoordinate.col = -1;
    selectedCoordinate.row = -1;
    moveCoordinates = [];
  } else {
    // Checks if a moveCoordinates were selected.
    for (const moveCoordinate of moveCoordinates) {
      if (moveCoordinate.col === mouseCoordinate.col && moveCoordinate.row === mouseCoordinate.row) {
        // Moves piece to the moveCoordinates.
        pieces[selectedCoordinate.col][selectedCoordinate.row].col = moveCoordinate.col;
        pieces[selectedCoordinate.col][selectedCoordinate.row].row = moveCoordinate.row;
        pieces[moveCoordinate.col][moveCoordinate.row] = pieces[selectedCoordinate.col][selectedCoordinate.row];
        pieces[selectedCoordinate.col][selectedCoordinate.row] = 'empty';
        // Checks if the piece becomes a king.
        if (moveCoordinate.row === 0 || moveCoordinate.row === 7) {
          pieces[moveCoordinate.col][moveCoordinate.row].isKing = true;
        }
        // Removes jumped pieces.
        for (const jump of moveCoordinate.jumps) {
          pieces[jump.col][jump.row] = 'empty';
        }
        selectedCoordinate.col = -1;
        selectedCoordinate.row = -1;
        moveCoordinates = [];
        renderPieces();
        board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
        return;
      }
    }
    // Check if a piece was selected.
    selectedCoordinate.col = mouseCoordinate.col;
    selectedCoordinate.row = mouseCoordinate.row;
    if (pieces[selectedCoordinate.col][selectedCoordinate.row] === 'empty') {
      moveCoordinates = [];
    } else {
      moveCoordinates = pieces[selectedCoordinate.col][selectedCoordinate.row].calculateMoves(pieces);
    }
  }
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
});

onkeyup = function(e) {
  if (e.keyCode === ESCAPE_KEYCODE) {
    selectedCoordinate = {col: -1, row: -1};
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
    for (let row = 5; row < 8; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        pieces[col][row] = new Piece(col, row, 'player-1');
      }
    }
  }
  // Creates player-2's pieces.
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < 3; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        pieces[col][row] = new Piece(col, row, 'player-2');
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
