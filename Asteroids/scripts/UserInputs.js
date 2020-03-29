"use strict";

import {CANVAS_FOREGROUND} from "./main.js";

// Get inputs.
export const userInputs = {"mousePosition": {x: 0, y: 0}};

onkeydown = onkeyup = (event) => {
  userInputs[event.keyCode] = event.type === `keydown`;
}

onmousedown = onmouseup = (e) => {
  if (event.button === 0) {
    userInputs[`leftMouseDown`] = event.type === `mousedown`;
  } else if (event.button === 2) {
    userInputs[`rightMouseDown`] = event.type === `mousedown`;
  }
}

onmousemove = (event) => {
  const rect = CANVAS_FOREGROUND.getBoundingClientRect();
  userInputs[`mousePosition`] = {x: event.clientX - rect.left, y: event.clientY - rect.top};
}
