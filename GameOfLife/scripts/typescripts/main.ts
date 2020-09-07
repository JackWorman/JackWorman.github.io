const CANVAS_BOARD: HTMLCanvasElement = getHTMLCanvasElementById('canvas-board')
const CONTEXT_BOARD: CanvasRenderingContext2D = getCanvasRenderingContext2D(CANVAS_BOARD);

const CANVAS_SIZE: number = 800;
CANVAS_BOARD.width = CANVAS_SIZE;
CANVAS_BOARD.height = CANVAS_SIZE;

const GRID_SIZE: number = 50;
const GRID_GAP_SIZE: number = CANVAS_SIZE / GRID_SIZE;

CONTEXT_BOARD.beginPath();
for (let i: number = 0; i <= 50; i++) {
  CONTEXT_BOARD.moveTo(i * GRID_GAP_SIZE, 0);
  CONTEXT_BOARD.lineTo(i * GRID_GAP_SIZE, CANVAS_SIZE);
  CONTEXT_BOARD.moveTo(0, i * GRID_GAP_SIZE);
  CONTEXT_BOARD.lineTo(CANVAS_SIZE, i * GRID_GAP_SIZE);
}
CONTEXT_BOARD.closePath();
CONTEXT_BOARD.stroke();

function getHTMLCanvasElementById(id: string): HTMLCanvasElement {
  const htmlCanvasElement = document.getElementById(id);
  if (htmlCanvasElement instanceof HTMLCanvasElement) {
    return htmlCanvasElement;
  }
  throw new Error('Could not get HTMLCanvasElement.');
}

function getCanvasRenderingContext2D(htmlCanvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
  const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
  if (canvasRenderingContext2D instanceof CanvasRenderingContext2D) {
    return canvasRenderingContext2D;
  }
  throw new Error('Could not get CanvasRenderingContext2D.');
}

CANVAS_BOARD.addEventListener('click', clickEvent);

function clickEvent(event: MouseEvent) {
  // e = Mouse click event.
  var rect = this.getBoundingClientRect();
  var x = event.clientX - rect.left; //x position within the element.
  var y = event.clientY - rect.top;  //y position within the element.
  console.log(`${x}, ${y}`);
}
