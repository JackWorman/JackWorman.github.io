import { getHTMLButtonElementById } from "./Helper.js";
import { CANVAS_BOARD, clickEvent, board, drawBoard } from "./Board.js";

const BUTTON: HTMLButtonElement = getHTMLButtonElementById('button-start-simulation');

let simulationIntervalId: number;

function startSimulation(): void {
    simulationIntervalId = window.setInterval(simulate, 500);
    BUTTON.innerHTML = 'Stop Simulation';
    BUTTON.addEventListener('click', stopSimulation, {once: true});
    CANVAS_BOARD.removeEventListener('click', clickEvent);
}

function stopSimulation(): void {
    window.clearInterval(simulationIntervalId);
    BUTTON.innerHTML = 'Start Simulation';
    BUTTON.addEventListener('click', startSimulation, {once: true});
    CANVAS_BOARD.addEventListener('click', clickEvent);
}

function simulate(): void {
    for (const col of board) {
        for (const cell of col) {
            if (cell.isAlive) {
                if (cell.neighborCount < 2) {
                    cell.isAlive = false;
                } else if (cell.neighborCount > 3) {
                    cell.isAlive = false;
                }
            } else if (cell.neighborCount === 3) {
                cell.isAlive = true;
            }
        }
    }
    drawBoard();
}

window.addEventListener('load', () => {
    drawBoard();
    CANVAS_BOARD.addEventListener('click', clickEvent);
    BUTTON.addEventListener('click', startSimulation, {once: true});
});
