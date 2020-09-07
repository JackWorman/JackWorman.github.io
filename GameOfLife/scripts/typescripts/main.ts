const CANVAS_BOARD = document.getElementById('canvas-board') as HTMLCanvasElement;
const CONTEXT_BOARD: CanvasRenderingContext2D = CANVAS_BOARD.getContext('2d');

CANVAS_BOARD.width = 800;
CANVAS_BOARD.height = 800;


for (let col: number = 0; col < 100; col++) {
  for (let row: number = 0; row < 100; row++) {
    CONTEXT_BOARD.beginPath();
    CONTEXT_BOARD.moveTo(col * 8, 0);
    CONTEXT_BOARD.lineTo(col * 8, 800);
    CONTEXT_BOARD.moveTo(0, row * 8);
    CONTEXT_BOARD.lineTo(800, row * 8);
  }
}
CONTEXT_BOARD.closePath();
CONTEXT_BOARD.stroke();
