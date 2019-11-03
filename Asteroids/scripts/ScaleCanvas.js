"use strict";

import {render} from "./main.js";

const BASE_SIZE = getComputedStyle(document.documentElement).getPropertyValue(`--base-size`);
const BASE_CANVAS_SIZE = 690;
const CANVAS_FOREGROUND = document.getElementById(`canvas-foreground`);

export let canvasSize;

/**
 * This must be done in Javascript because it clears the canvas constantly when using calc() in CSS.
 */
export function scaleCanvas() {
  canvasSize = BASE_CANVAS_SIZE * Math.min(document.body.clientWidth, document.body.clientHeight) / BASE_SIZE;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  window.requestAnimationFrame(render);
  console.log(`==========`);
  console.log(`canvasSize: ${canvasSize}`);
  console.log(`width: ${document.body.clientWidth}`);
  console.log(`height: ${document.body.clientHeight}`);
};

// window.onload = scaleCanvas;
window.addEventListener(`load`, scaleCanvas);
window.addEventListener(`resize`, scaleCanvas);
