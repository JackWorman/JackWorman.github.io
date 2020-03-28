"use strict";

import {MILLISECONDS_PER_SECOND} from "./Constants.js";
const DELTA_TIMES_BUFFER_SIZE = 100;
const DECIMALS = 2;

const SPAN_FPS = document.getElementById(`span-fps`);

let isInitialCall = true;
let deltaTimes;
let previousTime;

export function reset() {
  isInitialCall = true;
  display(0);
}

export function update() {
  // First time setup.
  if (isInitialCall) {
    deltaTimes = [];
    previousTime = performance.now();
    isInitialCall = false;
    return;
  }
  const currentTime = performance.now();
  deltaTimes.push(currentTime - previousTime);
  if (deltaTimes.length > DELTA_TIMES_BUFFER_SIZE) {
    deltaTimes.shift();
  }
  const averageDeltaTime = (deltaTimes.reduce((a, b) => (a + b)) / deltaTimes.length);
  display(MILLISECONDS_PER_SECOND/averageDeltaTime);
  previousTime = currentTime;
}

function display(fps) {
  window.requestAnimationFrame(() => SPAN_FPS.textContent = `FPS: ${fps.toFixed(DECIMALS)}`);
}
