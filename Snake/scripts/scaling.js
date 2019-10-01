'use strict';

import {render} from './main.js';

const BASE_SIZE = getComputedStyle(document.documentElement).getPropertyValue('--base-size');
const BASE_CANVAS_SIZE = 690;
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
let canvasSize;

/**
 * This must be done in Javascript because it clears the canvas constantly when using calc() in CSS.
 */
function scaleCanvas() {
  canvasSize = BASE_CANVAS_SIZE * Math.min(document.body.clientWidth, document.body.clientHeight) / BASE_SIZE;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  window.requestAnimationFrame(render);
};

window.addEventListener('load', scaleCanvas);
window.addEventListener('resize', scaleCanvas);
