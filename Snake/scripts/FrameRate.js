'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const DELTA_TIMES_BUFFER_SIZE = 100;
const SPAN_FPS = document.getElementById('span-fps');

let initialCall = true;
let deltaTimes;
let previousTime;

export function calculate() {
   // First time setup.
  if (initialCall) {
    deltaTimes = [];
    previousTime = performance.now();
    initialCall = false;
    return;
  }
  let currentTime = performance.now();
  deltaTimes.push(currentTime - previousTime);
  if (deltaTimes.length > DELTA_TIMES_BUFFER_SIZE) {
    deltaTimes.shift();
  }
  let averageDeltaTime = (deltaTimes.reduce((a, b) => (a + b)) / deltaTimes.length);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / averageDeltaTime).toFixed(2);
  previousTime = currentTime;
}

export function reset() {
  initialCall = true;
  SPAN_FPS.textContent = 'FPS: 0.00';
}
