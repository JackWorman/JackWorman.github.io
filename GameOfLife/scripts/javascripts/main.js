var CANVAS_BOARD = getHTMLCanvasElementById('canvas-board');
var CONTEXT_BOARD = getCanvasRenderingContext2D(CANVAS_BOARD);
var CANVAS_SIZE = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;
var GRID_SIZE = 50;
var GRID_GAP_SIZE = CANVAS_SIZE / GRID_SIZE;
CONTEXT_BOARD.beginPath();
for (var i = 0; i <= 50; i++) {
    CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
    CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
    CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
    CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
}
CONTEXT_BOARD.closePath();
CONTEXT_BOARD.stroke();
function getHTMLCanvasElementById(id) {
    var htmlCanvasElement = document.getElementById(id);
    if (htmlCanvasElement instanceof HTMLCanvasElement) {
        return htmlCanvasElement;
    }
    throw new Error('Could not get HTMLCanvasElement.');
}
function getCanvasRenderingContext2D(htmlCanvasElement) {
    var canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
    if (canvasRenderingContext2D instanceof CanvasRenderingContext2D) {
        return canvasRenderingContext2D;
    }
    throw new Error('Could not get CanvasRenderingContext2D.');
}
CANVAS_BOARD.addEventListener('click', clickEvent);
function clickEvent(event) {
    // e = Mouse click event.
    var rect = this.getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top; //y position within the element.
    console.log(x + ", " + y);
}
