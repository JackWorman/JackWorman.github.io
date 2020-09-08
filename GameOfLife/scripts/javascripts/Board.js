import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";
export const CANVAS_SIZE = 800;
export const GRID_SIZE = 50;
export const CANVAS_BOARD = getHTMLCanvasElementById('canvas-board');
const CONTEXT_BOARD = getCanvasRenderingContext2D(CANVAS_BOARD);
export const board = createEmptyBoard();
function createEmptyBoard() {
    const board = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < GRID_SIZE; j++) {
            board[i].push({ isAlive: false, neighborCount: 0 });
        }
    }
    return board;
}
export function clickEvent(event) {
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    const rect = this.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / SQUARE_SIZE);
    const row = Math.floor((event.clientY - rect.top) / SQUARE_SIZE);
    board[col][row].isAlive = !board[col][row].isAlive;
    drawBoard();
}
export function drawBoard() {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawAliveCells();
    drawGrid();
}
function drawAliveCells() {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[col][row]) {
                CONTEXT_BOARD.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}
function drawGrid() {
    const GRID_GAP_SIZE = CANVAS_SIZE / GRID_SIZE;
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
