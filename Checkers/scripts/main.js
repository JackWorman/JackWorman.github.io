'use strict';

import {Board} from './Board.js';
// import Piece from './Piece.js';
import {Piece, PLAYER_1, PLAYER_2} from './Piece.js';
import {Coordinate, UNDEFINED} from './Coordinate.js';

const ESCAPE_KEYCODE = 27;
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_CONTAINER = document.getElementById('canvas-container');

const board = new Board(GRID_SIZE, CANVAS_SIZE);
let pieces = [];
let mouseCoordinate = new Coordinate(UNDEFINED, UNDEFINED);
let selectedCoordinate = new Coordinate(UNDEFINED, UNDEFINED);
let moveCoordinates = [];
let turn = PLAYER_1;

onmousemove = function(e) {
  let boundingClientRect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinate.setCoordinate(
    Math.floor((e.clientX - boundingClientRect.left) / SQUARE_SIZE),
    Math.floor((e.clientY - boundingClientRect.top) / SQUARE_SIZE)
  );
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
}

CANVAS_CONTAINER.addEventListener('click', function() {
  // Checks if the selectedCoordinate were selected.
  if (Coordinate.compare(selectedCoordinate, mouseCoordinate)) {
    selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
    moveCoordinates = [];
  } else {
    // Checks if a moveCoordinate was selected.
    for (const moveCoordinate of moveCoordinates) {
      if (Coordinate.compare(moveCoordinate, mouseCoordinate)) {
        // movePiece();
        // ------------------------------------------------ MAKE THIS A FUNCTION
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
        // -----------------------------------------------


        selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
        moveCoordinates = [];
        renderPieces();
        board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
        // Check if a player won.
        checkIfAPlayerWon();
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
    selectedCoordinate.setCoordinate(mouseCoordinate.col, mouseCoordinate.row);
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
    selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
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

function checkIfAPlayerWon() {
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
    // initializeGame();
  } else if (!player2HasAPiece) {
    alert('Player 1 wins!');
    // initializeGame();
  }
}
