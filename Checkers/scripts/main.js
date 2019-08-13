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
var player1Pieces = [];
var player2Pieces = [];
var mouseCoordinates = {col: -1, row: -1};
var selectedCoordinates = {col: -1, row: -1};
var turn = 'player-1';
var availableMoves = [];

onmousemove = function(e) {
  var rect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinates = {
    col: Math.floor((e.clientX - rect.left) / SQUARE_SIZE),
    row: Math.floor((e.clientY - rect.top) / SQUARE_SIZE)
  };
  board.render(mouseCoordinates, selectedCoordinates);
}

CANVAS_CONTAINER.addEventListener('click', function() {
  if (selectedCoordinates.col === mouseCoordinates.col && selectedCoordinates.row === mouseCoordinates.row) {
    selectedCoordinates = {col: -1, row: -1};
  } else {
    selectedCoordinates = {col: mouseCoordinates.col, row: mouseCoordinates.row};
  }
  board.render(mouseCoordinates, selectedCoordinates);
});

onkeyup = function(e) {
  if (e.keyCode === ESCAPE_KEYCODE) {
    selectedCoordinates = {col: -1, row: -1};
    board.render(mouseCoordinates, selectedCoordinates);
  }
}

var initializeGame = (function() {
  CANVAS_CONTAINER.style.width = CANVAS_CONTAINER.style.height = (CANVAS_SIZE + 2) + 'px';
  //
  board = new Board(GRID_SIZE, CANVAS_SIZE);
  board.render(mouseCoordinates, selectedCoordinates);
  //
  Piece.initialize(CANVAS_SIZE, SQUARE_SIZE);
  // Creates and renders player-1's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 5; row < 8; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        player1Pieces.push(new Piece(col, row, 'player-1'));
      }
    }
  }
  for (var i = 0; i < player1Pieces.length; i++) {
    player1Pieces[i].render();
  }
  // Creates and renders player-2's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 0; row < 3; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        player2Pieces.push(new Piece(col, row, 'player-2'));
      }
    }
  }
  for (var i = 0; i < player2Pieces.length; i++) {
    player2Pieces[i].render();
  }
})();

function getPiece(col, row) {
  if (turn === 'player-1') {
    for (var piece in player1Pieces.length) {
      console.log(piece);
      if (piece.col === col && piece.row === row) {
        console.log(piece);
        return piece[i];
      }
    }
  } else if (turn === 'player-2') {
    for (var piece in player2Pieces.length) {
      if (piece.col === col && piece.row === row) {
        console.log(piece);
        return piece[i];
      }
    }
  }
  return null;
}

console.log(getPiece(0, 0));
console.log(getPiece(0, 1));
