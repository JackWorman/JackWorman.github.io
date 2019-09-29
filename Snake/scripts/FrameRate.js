'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const DELTA_TIMES_BUFFER_SIZE = 100;
const DECIMALS = 2;
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
  const currentTime = performance.now();
  deltaTimes.push(currentTime - previousTime);
  if (deltaTimes.length > DELTA_TIMES_BUFFER_SIZE) {
    deltaTimes.shift();
  }
  const averageDeltaTime = (deltaTimes.reduce((a, b) => (a + b)) / deltaTimes.length);
  window.requestAnimationFrame(() => display(MILLISECONDS_PER_SECOND / averageDeltaTime));
  previousTime = currentTime;
}

export function reset() {
  initialCall = true;
  window.requestAnimationFrame(() => display(0));
}

function display(fps) {
  SPAN_FPS.textContent = 'FPS: ' + fps.toFixed(DECIMALS);
}
