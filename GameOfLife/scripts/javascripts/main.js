import { getHTMLButtonElementById } from "./Helper.js";
import { CANVAS_BOARD, clickEvent, board, drawBoard } from "./Board.js";
const SIMULATION_RATE = 500;
const BUTTON = getHTMLButtonElementById('button-start-simulation');
let simulationIntervalId;
function startSimulation() {
    simulationIntervalId = window.setInterval(simulate, SIMULATION_RATE);
    BUTTON.innerHTML = 'Stop Simulation';
    BUTTON.addEventListener('click', stopSimulation, { once: true });
    CANVAS_BOARD.removeEventListener('click', clickEvent);
}
function stopSimulation() {
    window.clearInterval(simulationIntervalId);
    BUTTON.innerHTML = 'Start Simulation';
    BUTTON.addEventListener('click', startSimulation, { once: true });
    CANVAS_BOARD.addEventListener('click', clickEvent);
}
function simulate() {
    for (const col of board) {
        for (const cell of col) {
            if (cell.isAlive && (cell.neighborCount < 2 || cell.neighborCount > 3)) {
                cell.isAlive = false;
            }
            else if (!cell.isAlive && cell.neighborCount === 3) {
                cell.isAlive = true;
            }
        }
    }
    drawBoard();
}
window.addEventListener('load', () => {
    drawBoard();
    CANVAS_BOARD.addEventListener('click', clickEvent);
    BUTTON.addEventListener('click', startSimulation, { once: true });
});
