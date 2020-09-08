import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";
const CANVAS_BOARD = getHTMLCanvasElementById('canvas-board');
const CONTEXT_BOARD = getCanvasRenderingContext2D(CANVAS_BOARD);
const CANVAS_SIZE = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
const GRID_SIZE = 50;
const GRID_GAP_SIZE = CANVAS_SIZE / GRID_SIZE;
function clickEvent(event) {
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    const rect = this.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / SQUARE_SIZE);
    const row = Math.floor((event.clientY - rect.top) / SQUARE_SIZE);
    board[row][col] = !board[row][col];
    drawCells();
}
function drawGrid() {
    CONTEXT_BOARD.beginPath();
    for (let i = 0; i <= GRID_SIZE; i++) {
        CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
        CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
        CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
        CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
    }
    CONTEXT_BOARD.closePath();
    CONTEXT_BOARD.stroke();
}
function drawCells() {
    CONTEXT_BOARD.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col]) {
                CONTEXT_BOARD.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}
function createEmptyBoard() {
    const board = [];
    for (let i = 0; i < 50; i++) {
        board.push([]);
        for (let j = 0; j < 50; j++) {
            board[i].push(false);
        }
    }
    return board;
}
const board = createEmptyBoard();
window.addEventListener('load', () => {
    drawGrid();
    CANVAS_BOARD.addEventListener('click', clickEvent);
});
