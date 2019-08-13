'use strict';

import Board from './Board.js';
import Piece from './Piece.js';

// Board sizes
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_BOARD = document.getElementById('canvas-board');
const CANVAS_PIECES = document.getElementById('canvas-pieces');
const CONTEXT_BOARD = CANVAS_BOARD.getContext('2d');
const CONTEXT_PIECES = CANVAS_PIECES.getContext('2d');

var board = null;
var player1Pieces = [];
var player2Pieces = [];
var mouseCoordinates = null;
var selectedCoordinates = null;
var turn = 'player-1';
var availableMoves = [];

onmousemove = function(e) {
  var rect = CANVAS_BOARD.getBoundingClientRect();
  mouseCoordinates = {
    col: Math.floor((e.clientX - rect.left) / SQUARE_SIZE),
    row: Math.floor((e.clientY - rect.top) / SQUARE_SIZE)
  };
  board.render(CONTEXT_BOARD, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
}

CANVAS_PIECES.addEventListener('click', function() {
  selectedCoordinates = {
    col: mouseCoordinates.col,
    row: mouseCoordinates.row
  };
  calculateAvailableMoves();
  board.render(CONTEXT_BOARD, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
});

onkeyup = function(e) {
  e = e || event; // to deal with IE
  if (e.keyCode === 27) { // Escape
    selectedCoordinates = null;
    board.render(CONTEXT_BOARD, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
  }
}

function initializeBoard() {
  CANVAS_BOARD.width = CANVAS_BOARD.height = CANVAS_PIECES.width = CANVAS_PIECES.height = CANVAS_SIZE;
  board = new Board(GRID_SIZE);
  board.render(CONTEXT_BOARD, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
}

function initializePieces() {
  // Creates and renders player-1's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 5; row < 8; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        player1Pieces.push(new Piece(col, row, 'player-1'));
      }
    }
  }
  for (var i = 0; i < player1Pieces.length; i++) {
    player1Pieces[i].render(CONTEXT_PIECES, SQUARE_SIZE);
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
    player2Pieces[i].render(CONTEXT_PIECES, SQUARE_SIZE);
  }
}

function calculateAvailableMoves() {

}

initializeBoard();
initializePieces();
