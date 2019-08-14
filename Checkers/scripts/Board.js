'use strict';

// DOM Elements
const CANVAS_BOARD = document.getElementById('canvas-board');
const CONTEXT_BOARD = CANVAS_BOARD.getContext('2d');
// Colors
const CHECKER_COLOR_1 = 'rgb(139, 69, 19)';
const CHECKER_COLOR_2 = 'rgb(222, 184, 135)';
const HIGHLIGHT_COLOR = 'rgb(153, 204, 255)';
const SELECT_COLOR = 'rgb(0, 0, 255)';

export default class Board {
  constructor(gridSize, canvasSize) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    CANVAS_BOARD.width = CANVAS_BOARD.height = this.canvasSize;
  }

  render(mouseCoordinates, selectedCoordinates) {
    // Draws the checker board
    CONTEXT_BOARD.fillStyle = CHECKER_COLOR_1;
    CONTEXT_BOARD.fillRect(0, 0, this.canvasSize, this.canvasSize);
    CONTEXT_BOARD.fillStyle = CHECKER_COLOR_2;
    var squareSize = this.canvasSize / this.gridSize;
    for (var col = 0; col < this.gridSize; col++) {
      for (var row = 0; row < this.gridSize; row++) {
        if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
          CONTEXT_BOARD.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
      }
    }
    // Draws highlighted square
    if (mouseCoordinates !== null) {
      CONTEXT_BOARD.fillStyle = HIGHLIGHT_COLOR;
      CONTEXT_BOARD.fillRect(mouseCoordinates.col * squareSize, mouseCoordinates.row * squareSize, squareSize, squareSize);
    }
    // Draws selected square
    if (selectedCoordinates !== null) {
      CONTEXT_BOARD.fillStyle = SELECT_COLOR;
      CONTEXT_BOARD.fillRect(selectedCoordinates.col * squareSize, selectedCoordinates.row * squareSize, squareSize, squareSize);
    }
  }
}
