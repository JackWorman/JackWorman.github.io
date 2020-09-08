import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";

const CANVAS_BOARD: HTMLCanvasElement = getHTMLCanvasElementById('canvas-board')
const CONTEXT_BOARD: CanvasRenderingContext2D = getCanvasRenderingContext2D(CANVAS_BOARD);

const CANVAS_SIZE: number = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
const GRID_SIZE: number = 50;
const GRID_GAP_SIZE: number = CANVAS_SIZE / GRID_SIZE;

function clickEvent(this: HTMLCanvasElement, event: MouseEvent): void {
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    const rect = this.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / SQUARE_SIZE);
    const row = Math.floor((event.clientY - rect.top) / SQUARE_SIZE);
    board[row][col] = !board[row][col];
    drawCells();
}

function drawGrid(): void {
    CONTEXT_BOARD.beginPath();
    for (let i: number = 0; i <= GRID_SIZE; i++) {
        CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
        CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
        CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
        CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
    }
    CONTEXT_BOARD.closePath();
    CONTEXT_BOARD.stroke();
}

function drawCells(): void {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    for (let row: number = 0; row < GRID_SIZE; row++) {
        for (let col: number = 0; col < GRID_SIZE; col++) {
            if (board[row][col]) {
                CONTEXT_BOARD.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
    drawGrid();
}

function createEmptyBoard(): Array<Array<boolean>> {
    const board: Array<Array<boolean>> = [];
    for (let i: number = 0; i < 50; i++) {
        board.push([]);
        for (let j: number = 0; j < 50; j++) {
            board[i].push(false);
        }
    }
    return board;
}

const board: Array<Array<boolean>> = createEmptyBoard();

window.addEventListener('load', () => {
    drawGrid();
    CANVAS_BOARD.addEventListener('click', clickEvent);
});
