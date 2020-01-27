"use strict";

const CANVAS_TEMPLATE = document.getElementById(`canvas-circle-template`);
const CONTEXT_TEMPLATE = CANVAS_TEMPLATE.getContext(`2d`);

CANVAS_TEMPLATE.height = CANVAS_TEMPLATE.width = 1500;

CONTEXT_TEMPLATE.beginPath();
CONTEXT_TEMPLATE.arc(0, 0, 1500, 0, Math.PI/2, false);
CONTEXT_TEMPLATE.strokeStyle = 'rgb(255, 255, 255)';
CONTEXT_TEMPLATE.stroke();
