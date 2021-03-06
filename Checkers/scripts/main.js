'use strict';

import {Board} from './Board.js';
import {Piece, PLAYER_1, PLAYER_2} from './Piece.js';
import {Coordinate, UNDEFINED} from './Coordinate.js';

const ESCAPE_KEYCODE = 27;
const CANVAS_SIZE = 800; // in pixels
const GRID_SIZE = 8;
const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
// DOM Elements
const CANVAS_CONTAINER = document.getElementById('div-canvas-container');

const board = new Board(GRID_SIZE, CANVAS_SIZE);
const mouseCoordinate = new Coordinate(UNDEFINED, UNDEFINED);
const selectedCoordinate = new Coordinate(UNDEFINED, UNDEFINED);
let moveCoordinates = [];
let pieces = [];
let turn = PLAYER_1;

onmousemove = (e) => {
  let boundingClientRect = CANVAS_CONTAINER.getBoundingClientRect();
  mouseCoordinate.setCoordinate(
    Math.floor((e.clientX - boundingClientRect.left) / SQUARE_SIZE),
    Math.floor((e.clientY - boundingClientRect.top) / SQUARE_SIZE)
  );
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
}

CANVAS_CONTAINER.addEventListener('mouseup', () => {
  // Checks if the selectedCoordinate were selected.
  if (Coordinate.compare(selectedCoordinate, mouseCoordinate)) {
    selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
    moveCoordinates = [];
  // Checks if a moveCoordinate was selected.
  } else if (moveCoordinates.length !== 0) {
    for (const moveCoordinate of moveCoordinates) {
      if (Coordinate.compare(moveCoordinate, mouseCoordinate)) {
        movePiece(moveCoordinate);
        selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
        moveCoordinates = [];
        checkIfAPlayerWon();
        changeTurn();
        setHasMoveOnAllPieces();
        renderPieces();
        break;
      }
    }
  // Check if a piece was selected.
  } else if (pieces[mouseCoordinate.col][mouseCoordinate.row] !== 'empty'
    && pieces[mouseCoordinate.col][mouseCoordinate.row].hasMove) {
    selectedCoordinate.setCoordinate(mouseCoordinate.col, mouseCoordinate.row);
    let jumpsAvailable = checkForAvailableJumps();
    moveCoordinates = pieces[selectedCoordinate.col][selectedCoordinate.row].calculateMoves(pieces, jumpsAvailable);
  }
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
});

onkeyup = (e) => {
  if (e.keyCode === ESCAPE_KEYCODE) {
    selectedCoordinate.setCoordinate(UNDEFINED, UNDEFINED);
    moveCoordinates = [];
    board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
  }
}

const initializeGame = (() => {
  CANVAS_CONTAINER.style.width = CANVAS_CONTAINER.style.height = (CANVAS_SIZE + 2) + 'px';
  Piece.initialize(CANVAS_SIZE, SQUARE_SIZE);
  resetGame();
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
    resetGame();
  } else if (!player2HasAPiece) {
    alert('Player 1 wins!');
    resetGame();
  }
}

function changeTurn() {
  if (turn === PLAYER_1) {
    turn = PLAYER_2;
  } else if (turn === PLAYER_2) {
    turn = PLAYER_1;
  }
}

function movePiece(moveCoordinate) {
  // Moves piece to the moveCoordinates.
  pieces[selectedCoordinate.col][selectedCoordinate.row].coordinate.setCoordinate(moveCoordinate.col, moveCoordinate.row);
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
}

function resetGame() {
  turn = PLAYER_1;
  board.render(mouseCoordinate, selectedCoordinate, moveCoordinates);
  pieces = [];
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
  setHasMoveOnAllPieces();
  renderPieces();
}

function setHasMoveOnAllPieces() {
  let jumpsAvailable = checkForAvailableJumps();
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (pieces[col][row] !== 'empty') {
        if (pieces[col][row].player === turn && pieces[col][row].calculateMoves(pieces, jumpsAvailable).length > 0) {
          let hasJump = false;
          pieces[col][row].hasMove = true;
        } else {
          pieces[col][row].hasMove = false;
        }
      }
    }
  }
}

function checkForAvailableJumps() {
  let jumpsAvailable = false;
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (pieces[col][row] !== 'empty' && pieces[col][row].player === turn) {
        for (const move of pieces[col][row].calculateMoves(pieces, false)) {
          if (move.jumps.length > 0) {
            jumpsAvailable = true;
          }
        }
      }
    }
  }
}
