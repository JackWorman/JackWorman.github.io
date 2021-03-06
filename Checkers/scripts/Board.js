'use strict';

import {UNDEFINED} from './Coordinate.js';

// DOM Elements
const CANVAS_BOARD = document.getElementById('canvas-board');
const CONTEXT_BOARD = CANVAS_BOARD.getContext('2d');
// Colors
const CHECKER_COLOR_1 = 'rgb(139, 69, 19)';
const CHECKER_COLOR_2 = 'rgb(222, 184, 135)';
const HIGHLIGHT_COLOR = 'rgb(153, 204, 255)';
const SELECT_COLOR = 'rgb(0, 0, 255)';
const MOVE_COLOR = 'rgb(0, 255, 0)';

export class Board {
  constructor(gridSize, canvasSize) {
    Object.defineProperty(this, 'gridSize', {value: gridSize});
    Object.defineProperty(this, 'canvasSize', {value: canvasSize});
    Object.seal(this);
    CANVAS_BOARD.width = CANVAS_BOARD.height = this.canvasSize;
  }

  render(mouseCoordinate, selectedCoordinate, moveCoordinates) {
    // Draws the checker board.
    CONTEXT_BOARD.fillStyle = CHECKER_COLOR_1;
    CONTEXT_BOARD.fillRect(0, 0, this.canvasSize, this.canvasSize);
    CONTEXT_BOARD.fillStyle = CHECKER_COLOR_2;
    let squareSize = this.canvasSize / this.gridSize;
    for (let col = 0; col < this.gridSize; col++) {
      for (let row = 0; row < this.gridSize; row++) {
        if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
          CONTEXT_BOARD.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
      }
    }
    // Draws highlighted square.
    if (mouseCoordinate.col !== UNDEFINED && mouseCoordinate.row !== UNDEFINED) {
      CONTEXT_BOARD.fillStyle = HIGHLIGHT_COLOR;
      CONTEXT_BOARD.fillRect(mouseCoordinate.col * squareSize, mouseCoordinate.row * squareSize, squareSize, squareSize);
    }
    // Draws selected square.
    if (selectedCoordinate.col !== UNDEFINED && selectedCoordinate.row !== UNDEFINED) {
      CONTEXT_BOARD.fillStyle = SELECT_COLOR;
      CONTEXT_BOARD.fillRect(selectedCoordinate.col * squareSize, selectedCoordinate.row * squareSize, squareSize, squareSize);
    }
    // Draws move squares.
    CONTEXT_BOARD.fillStyle = MOVE_COLOR;
    for (const moveCoordinate of moveCoordinates) {
      CONTEXT_BOARD.fillRect(moveCoordinate.col * squareSize, moveCoordinate.row * squareSize, squareSize, squareSize);
    }
  }
}
