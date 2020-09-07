"use strict";
exports.__esModule = true;
var Helper_1 = require("./Helper");
var CANVAS_BOARD = Helper_1.getHTMLCanvasElementById('canvas-board');
var CONTEXT_BOARD = Helper_1.getCanvasRenderingContext2D(CANVAS_BOARD);
var CANVAS_SIZE = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
var GRID_SIZE = 50;
var GRID_GAP_SIZE = CANVAS_SIZE / GRID_SIZE;
CANVAS_BOARD.addEventListener('click', clickEvent);
function clickEvent(event) {
    var rect = this.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
}
function drawGrid() {
    CONTEXT_BOARD.beginPath();
    for (var i = 0; i <= 50; i++) {
        CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
        CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
        CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
        CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
    }
    CONTEXT_BOARD.closePath();
    CONTEXT_BOARD.stroke();
}
drawGrid();
var board = new Array(GRID_SIZE);
for (var _i = 0, board_1 = board; _i < board_1.length; _i++) {
    var col = board_1[_i];
    col = new Array(GRID_SIZE);
}
console.log(board);
