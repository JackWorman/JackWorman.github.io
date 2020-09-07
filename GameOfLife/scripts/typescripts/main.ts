import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from "./Helper.js";

const CANVAS_BOARD: HTMLCanvasElement = getHTMLCanvasElementById('canvas-board')
const CONTEXT_BOARD: CanvasRenderingContext2D = getCanvasRenderingContext2D(CANVAS_BOARD);

const CANVAS_SIZE: number = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
const GRID_SIZE: number = 50;
const GRID_GAP_SIZE: number = CANVAS_SIZE / GRID_SIZE;

CANVAS_BOARD.addEventListener('click', clickEvent);
function clickEvent(event: MouseEvent) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(x, y);
}

function drawGrid(): void {
    CONTEXT_BOARD.beginPath();
    for (let i: number = 0; i <= 50; i++) {
        CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
        CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
        CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
        CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
    }
    CONTEXT_BOARD.closePath();
    CONTEXT_BOARD.stroke();
}

drawGrid();

const board = [];
for (let i: number = 0; i <= 50; i++) {
    board.push([]);
    for (let j: number = 0; j <= 50; j++) {
        board[i].push(new Array(GRID_SIZE));
    }
}
board[30][30] = -1;
console.log(board);
