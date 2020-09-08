import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";
const CANVAS_BOARD = getHTMLCanvasElementById('canvas-board');
const CONTEXT_BOARD = getCanvasRenderingContext2D(CANVAS_BOARD);
const BUTTON = document.getElementById('button-start-simulation');
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
    board[col][row] = !board[col][row];
    drawBoard();
}
function drawBoard() {
    CONTEXT_BOARD.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawLiveCells();
    drawGrid();
}
function drawLiveCells() {
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
function createEmptyBoard2() {
    const board = [];
    for (let i = 0; i < 50; i++) {
        board.push([]);
        for (let j = 0; j < 50; j++) {
            board[i].push(0);
        }
    }
    return board;
}
let simulationIntervalId;
function startSimulation() {
    simulationIntervalId = window.setInterval(simulate, 500);
    BUTTON.innerHTML = 'Stop Simulation';
    BUTTON.addEventListener('click', stopSimulation, { once: true });
}
function stopSimulation() {
    window.clearInterval(simulationIntervalId);
    BUTTON.innerHTML = 'Start Simulation';
    BUTTON.addEventListener('click', startSimulation, { once: true });
}
function simulate() {
    const neighborCountBoard = createEmptyBoard2();
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            neighborCountBoard[col][row] = getNeighborCount(col, row);
        }
    }
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[col][row]) {
                if (neighborCountBoard[col][row] < 2) {
                    board[col][row] = false;
                }
                else if (neighborCountBoard[col][row] > 3) {
                    board[col][row] = false;
                }
            }
            else {
                if (neighborCountBoard[col][row] === 3) {
                    board[col][row] = true;
                }
            }
        }
    }
    drawBoard();
}
function getNeighborCount(col, row) {
    let count = 0;
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (i < 0 || j < 0 || i >= GRID_SIZE || j >= GRID_SIZE || (i === col && j === row)) {
                continue;
            }
            if (board[i][j]) {
                count++;
            }
        }
    }
    return count;
}
const board = createEmptyBoard();
window.addEventListener('load', () => {
    drawBoard();
    CANVAS_BOARD.addEventListener('click', clickEvent);
    BUTTON.addEventListener('click', startSimulation, { once: true });
});
