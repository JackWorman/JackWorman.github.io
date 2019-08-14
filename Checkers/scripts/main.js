'use strict';

import Board from './Board.js';
import Piece from './Piece.js';

const ESCAPE_KEYCODE = 27;
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_CONTAINER = document.getElementById('canvas-container');

var board = null;
var pieces = [];
var mouseCoordinates = {col: -1, row: -1};
var selectedCoordinates = {col: -1, row: -1};
var turn = 'player-1';
var moveCoordinates = [];

onmousemove = function(e) {
  var rect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinates = {
    col: Math.floor((e.clientX - rect.left) / SQUARE_SIZE),
    row: Math.floor((e.clientY - rect.top) / SQUARE_SIZE)
  };
  board.render(mouseCoordinates, selectedCoordinates, moveCoordinates);
}

CANVAS_CONTAINER.addEventListener('click', function() {
  // Checks if the selectedCoordinates were selected.
  if (selectedCoordinates.col === mouseCoordinates.col && selectedCoordinates.row === mouseCoordinates.row) {
    selectedCoordinates = {col: -1, row: -1};
    moveCoordinates = [];
  } else {
    // Checks if a moveCoordinates were selected.
    for (var i = 0; i < moveCoordinates.length; i++) {
      if (moveCoordinates[i].col === mouseCoordinates.col && moveCoordinates[i].row === mouseCoordinates.row) {
        pieces[selectedCoordinates.col][selectedCoordinates.row].col = moveCoordinates[i].col;
        pieces[selectedCoordinates.col][selectedCoordinates.row].row = moveCoordinates[i].row;
        pieces[moveCoordinates[i].col][moveCoordinates[i].row] = pieces[selectedCoordinates.col][selectedCoordinates.row];
        pieces[selectedCoordinates.col][selectedCoordinates.row] = 'empty';
        for (var j = 0; j < moveCoordinates[i].jumps.length; j++) {
          pieces[moveCoordinates[i].jumps[j].col][moveCoordinates[i].jumps[j].row] = 'empty';
        }
        selectedCoordinates = {col: -1, row: -1};
        moveCoordinates = [];
        renderPieces();
        board.render(mouseCoordinates, selectedCoordinates, moveCoordinates);
        return;
      }
    }
    //
    selectedCoordinates = {col: mouseCoordinates.col, row: mouseCoordinates.row};
    if (pieces[selectedCoordinates.col][selectedCoordinates.row] === 'empty') {
      moveCoordinates = [];
    } else {
      moveCoordinates = pieces[selectedCoordinates.col][selectedCoordinates.row].calculateMoves(pieces);
    }
  }
  board.render(mouseCoordinates, selectedCoordinates, moveCoordinates);
});

onkeyup = function(e) {
  if (e.keyCode === ESCAPE_KEYCODE) {
    selectedCoordinates = {col: -1, row: -1};
    moveCoordinates = [];
    board.render(mouseCoordinates, selectedCoordinates, moveCoordinates);
  }
}

var initializeGame = (function() {
  CANVAS_CONTAINER.style.width = CANVAS_CONTAINER.style.height = (CANVAS_SIZE + 2) + 'px';
  //
  board = new Board(GRID_SIZE, CANVAS_SIZE);
  board.render(mouseCoordinates, selectedCoordinates, moveCoordinates);
  //
  Piece.initialize(CANVAS_SIZE, SQUARE_SIZE);
  for (var col = 0; col < GRID_SIZE; col++) {
    pieces.push([]);
    for (var row = 0; row < GRID_SIZE; row++) {
      pieces[col].push('empty');
    }
  }
  // Creates player-1's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 5; row < 8; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        var piece = new Piece(col, row, 'player-1');
        pieces[col][row] = piece;
      }
    }
  }
  // Creates player-2's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 0; row < 3; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        var piece = new Piece(col, row, 'player-2');
        pieces[col][row] = piece;
      }
    }
  }
  //
  renderPieces();
})();

function renderPieces() {
  Piece.clearCanvas();
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 0; row < GRID_SIZE; row++) {
      if (pieces[col][row] !== 'empty') {
        pieces[col][row].render();
      }
    }
  }
}
