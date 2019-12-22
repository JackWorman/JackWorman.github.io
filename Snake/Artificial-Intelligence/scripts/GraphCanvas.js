"use strict";

import {canvasSize, bestFitnesses} from "./main.js";

const CANVAS_GRAPH = document.getElementById(`canvas-graph`);
const CONTEXT_GRAPH = CANVAS_GRAPH.getContext(`2d`);

function relMouseCoords(event) {
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  let canvasX = 0;
  let canvasY = 0;
  let currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while (currentElement = currentElement.offsetParent);

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;
  return {x: canvasX, y: canvasY};
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

export function renderGraph() {
  const WHITE = `rgb(255, 255, 255)`;
  CONTEXT_GRAPH.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_GRAPH.font = `14px Arial`;
  CONTEXT_GRAPH.strokeStyle = WHITE;
  CONTEXT_GRAPH.fillStyle = WHITE;
  CONTEXT_GRAPH.textAlign = `left`;
  CONTEXT_GRAPH.textBaseline = `middle`;
  if (bestFitnesses.length < 2) {
    CONTEXT_GRAPH.fillText(`Best Fitnesses vs. Generation (Note: Needs at least two data points.)`, 10, 16);
  } else {
    CONTEXT_GRAPH.fillText(`Best Fitnesses vs. Generation`, 10, 16);
  }
  if (bestFitnesses.length === 0) return;
  const maxFitness = Math.max(...bestFitnesses);
  CONTEXT_GRAPH.fillText(`Overall Best Fitness: ${maxFitness.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 10, 40);
  if (bestFitnesses.length === 1) return;

  CONTEXT_GRAPH.beginPath();
  CONTEXT_GRAPH.moveTo(0, canvasSize - canvasSize*bestFitnesses[0]/maxFitness);
  for (let i = 1; i < bestFitnesses.length; i++) {
    CONTEXT_GRAPH.lineTo(canvasSize*i/(bestFitnesses.length - 1), canvasSize - canvasSize*bestFitnesses[i]/maxFitness);
  }
  CONTEXT_GRAPH.strokeStyle = WHITE;
  CONTEXT_GRAPH.stroke();
}

function renderCrosshair(event) {
  if (bestFitnesses.length < 2) return;
  const RED = `rgb(255, 0, 0)`;
  const maxFitness = Math.max(...bestFitnesses);
  const mousePos = CANVAS_GRAPH.relMouseCoords(event);

  const hoverXOffset = canvasSize/(bestFitnesses.length - 1)/2;
  for (let i = 0; i < bestFitnesses.length; i++) {
    const x = canvasSize*i/(bestFitnesses.length - 1);
    const y = canvasSize - canvasSize*bestFitnesses[i]/maxFitness;
    if (mousePos.x > x - hoverXOffset && mousePos.x <= x + hoverXOffset) {
      renderGraph();
      // Draws the crosshairs.
      CONTEXT_GRAPH.beginPath();
      CONTEXT_GRAPH.moveTo(0, y);
      CONTEXT_GRAPH.lineTo(canvasSize, y);
      CONTEXT_GRAPH.moveTo(x, 0);
      CONTEXT_GRAPH.lineTo(x, canvasSize);
      CONTEXT_GRAPH.strokeStyle = RED;
      CONTEXT_GRAPH.stroke();
      // Draws the coordinate.
      let xOffset = (x < canvasSize/2) ? 5 : -5;
      CONTEXT_GRAPH.textAlign = (x < canvasSize/2) ? `left` : `right`;
      let yOffset = (y < canvasSize/2) ? 12 : -12;
      CONTEXT_GRAPH.fillStyle = RED;
      CONTEXT_GRAPH.font = `bold 14px Arial`;
      CONTEXT_GRAPH.fillText(
        `(${i}, ${bestFitnesses[i].toLocaleString(undefined, {maximumFractionDigits: 2})})`,
        x + xOffset,
        y + yOffset
      );
      break;
    }
  }
}

CANVAS_GRAPH.addEventListener(`mousemove`, (event) => { renderCrosshair(event); });

CANVAS_GRAPH.addEventListener(`mouseout`, renderGraph);
