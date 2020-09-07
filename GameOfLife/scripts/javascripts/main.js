var CANVAS_BOARD = document.getElementById('canvas-board');
var CONTEXT_BOARD = CANVAS_BOARD.getContext('2d');
CANVAS_BOARD.width = 800;
CANVAS_BOARD.height = 800;
for (var col = 0; col < 100; col++) {
    for (var row = 0; row < 100; row++) {
        CONTEXT_BOARD.beginPath();
        CONTEXT_BOARD.moveTo(col * 800, 0);
        CONTEXT_BOARD.lineTo(col * 800, row * 800);
        CONTEXT_BOARD.closePath();
    }
}
CONTEXT_BOARD.stroke();
