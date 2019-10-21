// DOM elements
const CANVAS_1 = document.getElementById('canvas-1');
const CANVAS_2 = document.getElementById('canvas-2');
const CANVAS_3 = document.getElementById('canvas-3');
const CONTEXT_1 = CANVAS_1.getContext('2d');
const CONTEXT_2 = CANVAS_2.getContext('2d');
const CONTEXT_3 = CANVAS_3.getContext('2d');

CANVAS_1.addEventListener('mousemove', () => {
  alert('mousemove');
});

CANVAS_2.addEventListener('mousedown', () => {
  alert('mousedown');
});

CANVAS_3.addEventListener('mouseup', () => {
  alert('mouseup');
});
