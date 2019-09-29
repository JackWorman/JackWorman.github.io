'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const SPAN_FPS = document.getElementById('span-fps');

let deltas = [];
let then;

export function calculate() {
   // First time setup.
  if (deltas.length === 0) {
    deltas = [];
    then = performance.now();
    return;
  }
  let now = performance.now();
  deltas.push(now - then);
  if (deltas.length > 100) {
    deltas.shift();
  }
  let averageDelta = (deltas.reduce((a, b) => (a + b)) / deltas.length);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / averageDelta).toFixed(2);
  then = now;
}

export function reset() {
  deltas = [];
  SPAN_FPS.textContent = 'FPS: 0.00';
}
