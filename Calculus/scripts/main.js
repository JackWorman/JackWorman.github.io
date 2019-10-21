// DOM elements
const CANVAS_1 = document.getElementById('canvas-1');
const CANVAS_2 = document.getElementById('canvas-2');
const CANVAS_3 = document.getElementById('canvas-3');
const CONTEXT_1 = CANVAS_1.getContext('2d');
const CONTEXT_2 = CANVAS_2.getContext('2d');
const CONTEXT_3 = CANVAS_3.getContext('2d');

let isDrawing = false;
let boundingClientRect = CANVAS_1.getBoundingClientRect();
let x = 0;
let y = 0;


CONTEXT_1.strokeStyle = 'white';
CONTEXT_1.lineWidth = 3;


CANVAS_1.addEventListener('mousedown', (e) => {
  isDrawing = true;
  x = e.clientX - boundingClientRect.left;
  y = e.clientY - boundingClientRect.top;
  CONTEXT_1.beginPath();
  CONTEXT_1.moveTo(x, y);
});

CANVAS_1.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    x = e.clientX - boundingClientRect.left;
    y = e.clientY - boundingClientRect.top;
    CONTEXT_1.lineTo(x, y);
    CONTEXT_1.stroke();
    CONTEXT_1.closePath();
    //
    CONTEXT_1.beginPath();
    CONTEXT_1.moveTo(x, y);
  }
});

CANVAS_1.addEventListener('mouseup', (e) => {
  if (isDrawing) {
    isDrawing = true;
    x = e.clientX - boundingClientRect.left;
    y = e.clientY - boundingClientRect.top;
    CONTEXT_1.lineTo(x, y);
    CONTEXT_1.stroke();
    CONTEXT_1.closePath();
  }
});
