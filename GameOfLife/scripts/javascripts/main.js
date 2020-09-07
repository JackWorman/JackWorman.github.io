import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";
const CANVAS_BOARD = getHTMLCanvasElementById('canvas-board');
const CONTEXT_BOARD = getCanvasRenderingContext2D(CANVAS_BOARD);
const CANVAS_SIZE = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
const GRID_SIZE = 50;
const GRID_GAP_SIZE = CANVAS_SIZE / GRID_SIZE;
function clickEvent(event) {
    const rect = this.getBoundingClientRect();
    const x = (event.clientX - rect.left) % (GRID_SIZE / CANVAS_SIZE);
    const y = (event.clientY - rect.top) % (GRID_SIZE / CANVAS_SIZE);
    console.log(x, y);
    board[y][x] = !board[y][x];
    console.log(board);
}
function drawGrid() {
    CONTEXT_BOARD.beginPath();
    for (let i = 0; i <= 50; i++) {
        CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
        CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
        CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
        CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
    }
    CONTEXT_BOARD.closePath();
    CONTEXT_BOARD.stroke();
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
