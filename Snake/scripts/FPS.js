'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const SPAN_FPS = document.getElementById('span-fps');

export function calculateFPS() {
  if (typeof calculateFPS.deltas === 'undefined') { // First time setup.
    calculateFPS.deltas = [];
    calculateFPS.then = performance.now();
    return;
  }
  let now = performance.now();
  calculateFPS.deltas.push(now - calculateFPS.then);
  if (calculateFPS.deltas.length > 100) {
    calculateFPS.deltas.shift();
  }
  let averageDelta = (calculateFPS.deltas.reduce((a, b) => (a + b)) / calculateFPS.deltas.length);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / averageDelta).toFixed(2);
  calculateFPS.then = now;
}
