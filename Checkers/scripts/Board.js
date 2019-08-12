'use strict';

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
    CONTEXT_BACKGROUND.fillStyle = CHECKER_COLOR_2;
    CONTEXT_BACKGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    CONTEXT_BACKGROUND.fillStyle = CHECKER_COLOR_1;
    // Draws the checker board
    for (var col = 0; col < GRID_SIZE; col++) {
      for (var row = 0; row < GRID_SIZE; row++) {
        if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) {
          CONTEXT_BACKGROUND.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
      }
    }
    // Draws highlighted square
    if (mouseCoordinates !== null) {
      CONTEXT_BACKGROUND.fillStyle = HIGHLIGHT_COLOR;
      CONTEXT_BACKGROUND.fillRect(mouseCoordinates.col * SQUARE_SIZE, mouseCoordinates.row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
    // Draws selected square
    if (selectedCoordinates !== null) {
      CONTEXT_BACKGROUND.fillStyle = SELECT_COLOR;
      CONTEXT_BACKGROUND.fillRect(selectedCoordinates.col * SQUARE_SIZE, selectedCoordinates.row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
      highlightAvailableMoves();
    }
  }
}
