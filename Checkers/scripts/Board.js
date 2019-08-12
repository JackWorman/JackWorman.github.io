'use strict';

const CHECKER_COLOR_1 = 'rgb(139, 69, 19)';
const CHECKER_COLOR_2 = 'rgb(222, 184, 135)';
const HIGHLIGHT_COLOR = 'rgb(153, 204, 255)';
const SELECT_COLOR = 'rgb(0, 0, 255)';

export default class Board {
  constructor() {
    this.pieces = [];
    this.board = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];
  }

  render(context, highlightedCoordinates, selectedCoordinates) {
    context.fillStyle = CHECKER_COLOR_1;
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.fillStyle = CHECKER_COLOR_2;
    // Draws the checker board
    for (var col = 0; col < GRID_SIZE; col++) {
      for (var row = 0; row < GRID_SIZE; row++) {
        if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
          context.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
      }
    }
    // Draws highlighted square
    if (mouseCoordinates !== null) {
      context.fillStyle = HIGHLIGHT_COLOR;
      context.fillRect(mouseCoordinates.col * SQUARE_SIZE, mouseCoordinates.row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
    // Draws selected square
    if (selectedCoordinates !== null) {
      context.fillStyle = SELECT_COLOR;
      context.fillRect(selectedCoordinates.col * SQUARE_SIZE, selectedCoordinates.row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
      // highlightAvailableMoves();
    }
  }
}
