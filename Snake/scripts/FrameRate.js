'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const DELTA_TIMES_MAX_LENGTH = 100;
const SPAN_FPS = document.getElementById('span-fps');

let initialCall = true;
let deltaTimes = [];
let then;

export function calculate() {
   // First time setup.
  if (initialCall) {
    deltaTimes = [];
    then = performance.now();
    initialCall = false;
    return;
  }
  let now = performance.now();
  deltaTimes.push(now - then);
  if (deltaTimes.length > DELTA_TIMES_MAX_LENGTH) {
    deltaTimes.shift();
  }
  let averageDeltaTime = (deltaTimes.reduce((a, b) => (a + b)) / deltaTimes.length);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / averageDeltaTime).toFixed(2);
  then = now;
}

export function reset() {
  initialCall = true;
  SPAN_FPS.textContent = 'FPS: 0.00';
}
