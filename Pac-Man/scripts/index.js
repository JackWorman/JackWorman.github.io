const CANVAS_BACKGROUND = document.getElementById('canvas-background');
const CONTEXT_BACKGROUND = CANVAS_BACKGROUND.getContext('2d');

const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const GRID_SIZE = 30; // pixels

CANVAS_BACKGROUND.width = GRID_WIDTH * GRID_SIZE;
CANVAS_BACKGROUND.height = GRID_HEIGHT * GRID_SIZE;

const WALLS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

for (var i = 0; i < GRID_HEIGHT; i++;) {
  for (var j = 0; j < GRID_HEIGHT; j++;) {

  }
}
