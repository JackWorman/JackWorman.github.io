'use strict';

import Piece from './Piece.js';

const LIGHT_BROWN = 'rgb(222, 184, 135)';
const DARK_BROWN = 'rgb(139, 69, 19)';

const CANVAS_SIZE = 700; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_BACKGROUND = document.getElementById('canvas-background');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_BACKGROUND = CANVAS_BACKGROUND.getContext('2d');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');

var player1Pieces = [];
var player2Pieces = [];
var mousePosition = {x: -1, y: -1};

function initializeBoard() {
  CANVAS_BACKGROUND.width = CANVAS_BACKGROUND.height = CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = CANVAS_SIZE;
  renderBoard();
}

function renderBoard() {
  CONTEXT_BACKGROUND.fillStyle = DARK_BROWN;
  CONTEXT_BACKGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  CONTEXT_BACKGROUND.fillStyle = LIGHT_BROWN;
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 0; row < GRID_SIZE; row++) {
      if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
        CONTEXT_BACKGROUND.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
      }
    }
  }
}

function initializePieces() {
  // Creates and renders player-1's pieces
  for (var col = 0; col < GRID_SIZE; col++) {
    for (var row = 5; row < 8; row++) {
      if ((col % 2 !== 0 && row % 2 === 0) || (col % 2 === 0 && row % 2 !== 0)) {
        player1Pieces.push(new Piece(col, row, 'one'));
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
        player2Pieces.push(new Piece(col, row, 'two'));
      }
    }
  }
  for (var i = 0; i < player2Pieces.length; i++) {
    player2Pieces[i].render(CONTEXT_FOREGROUND, SQUARE_SIZE);
  }
}

onmousemove = function(e) {
  var rect = CANVAS_BACKGROUND.getBoundingClientRect();
  mousePosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  var col = Math.floor(mousePosition.x / SQUARE_SIZE);
  var row = Math.floor(mousePosition.y / SQUARE_SIZE);
  console.log(col + ' - ' + row);
  renderBoard();
  CONTEXT_BACKGROUND.fillStyle = 'rgb(0, 0, 200)';
  CONTEXT_BACKGROUND.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

initializeBoard();
initializePieces();
