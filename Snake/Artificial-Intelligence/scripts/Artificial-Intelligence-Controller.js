"use strict";

import {GRID_SIZE, canvasSize} from "./main.js";

export function updateInputLayer(evolutionaryAlgorithm, snake, pellet) {
  const inputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].layers[0].elements;
  // Distance from wall, body, and fruit nodes.
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        inputLayer[count++][0] = detectWall(x, y, snake);
        inputLayer[count++][0] = detectBody(x, y, snake);
        inputLayer[count++][0] = detectFruit(x, y, snake, pellet);
      }
    }
  }
  // Current direction nodes.
  inputLayer[24][0] = (snake.direction === `left`)  ? 1 : 0;
  inputLayer[25][0] = (snake.direction === `up`)    ? 1 : 0;
  inputLayer[26][0] = (snake.direction === `right`) ? 1 : 0;
  inputLayer[27][0] = (snake.direction === `down`)  ? 1 : 0;
}

function detectWall(horizontal, vertical, snake) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {x: snake.bodySegments[0].x + count * horizontal, y: snake.bodySegments[0].y + count * vertical};
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      return 1 - (count - 1) / (GRID_SIZE - 1);
    }
  }
}

function detectBody(horizontal, vertical, snake) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {x: snake.bodySegments[0].x + count * horizontal, y: snake.bodySegments[0].y + count * vertical};
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      return 0;
    }
    // Check for snake body.
    for (const body of snake.bodySegments) {
      if (testPoint.x === body.x && testPoint.y === body.y) {
        return 1 - (count - 1) / (GRID_SIZE - 1);
      }
    }
  }
}

function detectFruit(horizontal, vertical, snake, pellet) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {x: snake.bodySegments[0].x + count * horizontal, y: snake.bodySegments[0].y + count * vertical};
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      return 0;
    }
    // Check for fruit.
    if (testPoint.x === pellet.x && testPoint.y === pellet.y) {
      return 1 - (count - 1) / (GRID_SIZE - 1);
    }
  }
}

export function getDirectionFromOutputLayer(evolutionaryAlgorithm, snake) {
  const outputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie]
    .layers[evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].layers.length - 1].elements;
  const outputLayerDirections = [
    {direction: `left`,  intensity: outputLayer[0][0]},
    {direction: `up`,    intensity: outputLayer[1][0]},
    {direction: `right`, intensity: outputLayer[2][0]},
    {direction: `down`,  intensity: outputLayer[3][0]}
  ];
  outputLayerDirections.sort((a, b) => { return b.intensity - a.intensity; });
  if ( snake.direction === `left`  && outputLayerDirections[0].direction === `right`
    || snake.direction === `up`    && outputLayerDirections[0].direction === `down`
    || snake.direction === `right` && outputLayerDirections[0].direction === `left`
    || snake.direction === `down`  && outputLayerDirections[0].direction === `up`) {
    return outputLayerDirections[1].direction;
  } else {
    return outputLayerDirections[0].direction;
  }
}
