'use strict';

import Board from './Board.js';
import Piece from './Piece.js';

// Board sizes
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_BACKGROUND = document.getElementById('canvas-background');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_BACKGROUND = CANVAS_BACKGROUND.getContext('2d');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');

var board = null;
var player1Pieces = [];
var player2Pieces = [];
var mouseCoordinates = null;
var selectedCoordinates = null;
var turn = 'player-1';

onmousemove = function(e) {
  var rect = CANVAS_BACKGROUND.getBoundingClientRect();
  mouseCoordinates = {
    col: Math.floor((e.clientX - rect.left) / SQUARE_SIZE),
    row: Math.floor((e.clientY - rect.top) / SQUARE_SIZE)
  };
  board.render(CONTEXT_BACKGROUND, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
}

CANVAS_FOREGROUND.addEventListener('click', function() {
  selectedCoordinates = {
    col: mouseCoordinates.col,
    row: mouseCoordinates.row
  };
  board.render(CONTEXT_BACKGROUND, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
});

onkeyup = function(e) {
  e = e || event; // to deal with IE
  if (e.keyCode === 27) { // Escape
    selectedCoordinates = null;
    board.render(CONTEXT_BACKGROUND, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
  }
}

function initializeBoard() {
  CANVAS_BACKGROUND.width = CANVAS_BACKGROUND.height = CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = CANVAS_SIZE;
  board = new Board(GRID_SIZE);
  board.render(CONTEXT_BACKGROUND, CANVAS_SIZE, mouseCoordinates, selectedCoordinates);
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
    player1Pieces[i].render(CONTEXT_FOREGROUND, SQUARE_SIZE);
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
    player2Pieces[i].render(CONTEXT_FOREGROUND, SQUARE_SIZE);
  }
}

function highlightAvailableMoves() {
  if (turn === 'player-1') {
    for (var i = 0; i < player1Pieces.length; i++) {
      if (player1Pieces[i].col === selectedCoordinates.col && player1Pieces[i].row === selectedCoordinates.row) {

      }
    }
  } else {
    // player-2
  }
}

initializeBoard();
initializePieces();
