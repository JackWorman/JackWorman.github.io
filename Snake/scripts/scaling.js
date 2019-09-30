'use strict';

const BASE_SIZE = getComputedStyle(document.documentElement).getPropertyValue('--base-size');
const BASE_CANVAS_SIZE = 690;
/**
 * This must be done in Javascript because it clears the canvas constantly when using calc() in CSS.
 */
function scaleCanvas() {
  canvasSize = BASE_CANVAS_SIZE * Math.min(document.body.clientWidth, document.body.clientHeight) / BASE_SIZE;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  window.requestAnimationFrame(render);
};

export window.addEventListener('load', scaleCanvas);
export window.addEventListener('resize', scaleCanvas);
