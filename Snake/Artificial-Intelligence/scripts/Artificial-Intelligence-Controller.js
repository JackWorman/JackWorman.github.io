"use strict";

import {GRID_SIZE, canvasSize} from "./main.js";

const CANVAS_NEURAL_NETWORK = document.getElementById(`canvas-neural-network`);
const CONTEXT_NEURAL_NETWORK = CANVAS_NEURAL_NETWORK.getContext(`2d`);

export function updateInputLayer(evolutionaryAlgorithm, snake, pellet) {
  const inputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].i.elements;
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
  inputLayer[24][0] = (snake.direction === `left`  ? 1 : 0);
  inputLayer[25][0] = (snake.direction === `up`    ? 1 : 0);
  inputLayer[26][0] = (snake.direction === `right` ? 1 : 0);
  inputLayer[27][0] = (snake.direction === `down`  ? 1 : 0);
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
  const outputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].o.elements;
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

export function renderNeuralNetwork(evolutionaryAlgorithm) {
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
  // Render weights between input layer and hidden layer.
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 16; j++) {
      CONTEXT_NEURAL_NETWORK.beginPath();
      CONTEXT_NEURAL_NETWORK.moveTo(canvasSize/6, canvasSize/(28 + 1)*(i + 1));
      CONTEXT_NEURAL_NETWORK.lineTo(canvasSize/2, canvasSize/(16 + 1)*(j + 1));
      CONTEXT_NEURAL_NETWORK.closePath();
      const intensity = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].i.elements[i][0];
      if (evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].w1.elements[j][i] < 0) {
        CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 0, 0, ${intensity})`;
      } else {
        CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(0, 0, 255, ${intensity})`;
      }
      CONTEXT_NEURAL_NETWORK.stroke();
    }
  }
  // Render weights between hidden layer and output layer.
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 4; j++) {
      CONTEXT_NEURAL_NETWORK.beginPath();
      CONTEXT_NEURAL_NETWORK.moveTo(canvasSize/2, canvasSize/(16 + 1)*(i + 1));
      CONTEXT_NEURAL_NETWORK.lineTo(5*canvasSize/6, canvasSize/(4 + 1)*(j + 1));
      CONTEXT_NEURAL_NETWORK.closePath();
      const intensity = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].hL.elements[i][0];
      if (evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].w2.elements[j][i] < 0) {
        CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 0, 0, ${intensity})`;
      } else {
        CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(0, 0, 255, ${intensity})`;
      }
      CONTEXT_NEURAL_NETWORK.stroke();
    }
  }
  // Render input layer.
  for (let i = 0; i < 28; i++) {
    const intensity = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].i.elements[i][0] * 255;
    CONTEXT_NEURAL_NETWORK.beginPath();
    CONTEXT_NEURAL_NETWORK.arc(canvasSize/6, canvasSize/(28 + 1)*(i + 1), 8, 0, 2*Math.PI);
    CONTEXT_NEURAL_NETWORK.closePath();
    CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
    CONTEXT_NEURAL_NETWORK.lineWidth = 1;
    CONTEXT_NEURAL_NETWORK.stroke();
    CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
    CONTEXT_NEURAL_NETWORK.fill();
  }
  // Render hidden layer.
  for (let i = 0; i < 16; i++) {
    const intensity = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].hL.elements[i][0] * 255;
    CONTEXT_NEURAL_NETWORK.beginPath();
    CONTEXT_NEURAL_NETWORK.arc(canvasSize/2, canvasSize/(16 + 1)*(i + 1), 8, 0, 2*Math.PI);
    CONTEXT_NEURAL_NETWORK.closePath();
    CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
    CONTEXT_NEURAL_NETWORK.lineWidth = 1;
    CONTEXT_NEURAL_NETWORK.stroke();
    CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
    CONTEXT_NEURAL_NETWORK.fill();
  }
  // Render output layer.
  for (let i = 0; i < 4; i++) {
    const intensity = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].o.elements[i][0] * 255;
    CONTEXT_NEURAL_NETWORK.beginPath();
    CONTEXT_NEURAL_NETWORK.arc(5*canvasSize/6, canvasSize/(4 + 1)*(i + 1), 8, 0, 2*Math.PI);
    CONTEXT_NEURAL_NETWORK.closePath();
    CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
    CONTEXT_NEURAL_NETWORK.lineWidth = 1;
    CONTEXT_NEURAL_NETWORK.stroke();
    CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
    CONTEXT_NEURAL_NETWORK.fill();
  }
}
