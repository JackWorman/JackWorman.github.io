'use strict';

const CHECKER_COLOR_1 = 'rgb(139, 69, 19)';
const CHECKER_COLOR_2 = 'rgb(222, 184, 135)';
const HIGHLIGHT_COLOR = 'rgb(153, 204, 255)';
const SELECT_COLOR = 'rgb(0, 0, 255)';

export default class Board {
  constructor(size) {
    this.size = size;
    this.board = [];
    for (var row = 0; row < this.size; row++) {
      this.board.push([]);
      for (var col = 0; col < this.size; col++) {
        this.board[row].push(null);
      }
    }
    this.pieces = [];
  }

  initializeBoard() {
    
  }

  render(context, canvasSize, mouseCoordinates, selectedCoordinates) {
    context.fillStyle = CHECKER_COLOR_1;
    context.fillRect(0, 0, canvasSize, canvasSize);
    var squareSize = canvasSize / this.size;
    context.fillStyle = CHECKER_COLOR_2;
    // Draws the checker board
    for (var col = 0; col < this.size; col++) {
      for (var row = 0; row < this.size; row++) {
        if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
          context.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
      }
    }
    // Draws highlighted square
    if (mouseCoordinates !== null) {
      context.fillStyle = HIGHLIGHT_COLOR;
      context.fillRect(mouseCoordinates.col * squareSize, mouseCoordinates.row * squareSize, squareSize, squareSize);
    }
    // Draws selected square
    if (selectedCoordinates !== null) {
      context.fillStyle = SELECT_COLOR;
      context.fillRect(selectedCoordinates.col * squareSize, selectedCoordinates.row * squareSize, squareSize, squareSize);
    }
  }
}
