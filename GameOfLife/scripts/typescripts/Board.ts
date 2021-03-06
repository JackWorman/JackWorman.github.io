import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";

interface Cell {
    isAlive: boolean;
    neighborCount: number;
}

export const CANVAS_SIZE: number = 800;
export const GRID_SIZE: number = 50;

export const CANVAS_BOARD: HTMLCanvasElement = getHTMLCanvasElementById('canvas-board')
const CONTEXT_BOARD: CanvasRenderingContext2D = getCanvasRenderingContext2D(CANVAS_BOARD);

export const board: Array<Array<Cell>> = createEmptyBoard();

function createEmptyBoard(): Array<Array<Cell>> {
    const board: Array<Array<Cell>> = [];
    for (let i: number = 0; i < GRID_SIZE; i++) {
        board.push([]);
        for (let j: number = 0; j < GRID_SIZE; j++) {
            board[i].push({isAlive: false, neighborCount: 0});
        }
    }
    return board;
}

export function clickEvent(this: HTMLCanvasElement, event: MouseEvent): void {
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    const rect = this.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / SQUARE_SIZE);
    const row = Math.floor((event.clientY - rect.top) / SQUARE_SIZE);
    board[col][row].isAlive = !board[col][row].isAlive;
    drawBoard();
}

export function drawBoard(): void {
    CONTEXT_BOARD.strokeStyle = CONTEXT_BOARD.fillStyle = 'rgb(255, 255, 255)';
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawAliveCells();
    drawGrid();
}

function drawAliveCells(): void {
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    for (let row: number = 0; row < GRID_SIZE; row++) {
        for (let col: number = 0; col < GRID_SIZE; col++) {
            if (board[col][row].isAlive) {
                CONTEXT_BOARD.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

function drawGrid(): void {
    const GRID_GAP_SIZE: number = CANVAS_SIZE / GRID_SIZE;
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

export function calculateNeighborCounts(): void {
    for (let col: number = 0; col < GRID_SIZE; col++) {
        for (let row: number = 0; row < GRID_SIZE; row++) {
            board[col][row].neighborCount = calculateNeighborCount(col, row);
        }
    }
}

function calculateNeighborCount(col: number, row: number): number {
    let count: number = 0;
    for (let i: number = col - 1; i <= col + 1; i++) {
        for (let j: number = row - 1; j <= row + 1; j++) {
            if (i < 0 || j < 0 || i >= GRID_SIZE || j >= GRID_SIZE || (i === col && j === row)) {
                continue;
            }
            if (board[i][j].isAlive) {
                count++;
            }
        }
    }
    return count;
}
