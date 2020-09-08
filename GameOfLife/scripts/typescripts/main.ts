import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";

const CANVAS_BOARD: HTMLCanvasElement = getHTMLCanvasElementById('canvas-board')
const CONTEXT_BOARD: CanvasRenderingContext2D = getCanvasRenderingContext2D(CANVAS_BOARD);
const BUTTON = document.getElementById('button-start-simulation') as HTMLButtonElement;

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
    board[col][row] = !board[col][row];
    drawBoard();
}

function drawBoard(): void {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawLiveCells();
    drawGrid();
}

function drawLiveCells(): void {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const SQUARE_SIZE = CANVAS_SIZE / GRID_SIZE;
    for (let row: number = 0; row < GRID_SIZE; row++) {
        for (let col: number = 0; col < GRID_SIZE; col++) {
            if (board[col][row]) {
                CONTEXT_BOARD.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
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

function createEmptyBoard2(): Array<Array<number>> {
    const board: Array<Array<number>> = [];
    for (let i: number = 0; i < 50; i++) {
        board.push([]);
        for (let j: number = 0; j < 50; j++) {
            board[i].push(0);
        }
    }
    return board;
}

let simulationIntervalId: number;
function startSimulation(): void {
    simulationIntervalId = window.setInterval(simulate, 500);
    BUTTON.innerHTML = 'Stop Simulation';
    BUTTON.removeEventListener('click', startSimulation);
    BUTTON.addEventListener('click', stopSimulation);
}

function stopSimulation(): void {
    window.clearInterval(simulationIntervalId);
    BUTTON.innerHTML = 'Start Simulation';
    BUTTON.removeEventListener('click', stopSimulation);
    BUTTON.addEventListener('click', startSimulation);
}

function simulate(): void {
    const neighborCountBoard: Array<Array<number>> = createEmptyBoard2();
    for (let row: number = 0; row < GRID_SIZE; row++) {
        for (let col: number = 0; col < GRID_SIZE; col++) {
            neighborCountBoard[col][row] = getNeighborCount(col, row);
        }
    }
    for (let row: number = 0; row < GRID_SIZE; row++) {
        for (let col: number = 0; col < GRID_SIZE; col++) {
            if (board[col][row]) {
                if (neighborCountBoard[col][row] < 2) {
                    board[col][row] = false;
                } else if (neighborCountBoard[col][row] > 3) {
                    board[col][row] = false;
                }
            } else {
                if (neighborCountBoard[col][row] === 3) {
                    board[col][row] = true;
                }
            }
        }
    }
    drawBoard();
}

function getNeighborCount(col: number, row: number): number {
    let count: number = 0;
    for (let i: number = col - 1; i <= col + 1; i++) {
        for (let j: number = row - 1; j <= row + 1; j++) {
            if (i < 0 || j < 0 || i >= GRID_SIZE || j >= GRID_SIZE ||( i === col && j === row)) {
                continue;
            }
            if (board[i][j]) {
                count++;
            }
        }
    }
    return count;
}

const board: Array<Array<boolean>> = createEmptyBoard();

window.addEventListener('load', () => {
    drawBoard();
    CANVAS_BOARD.addEventListener('click', clickEvent);
    BUTTON.addEventListener('click', startSimulation);
});
