"use strict";

import {GRID_SIZE, canvasSize} from "./main.js";

const CANVAS_NEURAL_NETWORK = document.getElementById(`canvas-neural-network`);
const CONTEXT_NEURAL_NETWORK = CANVAS_NEURAL_NETWORK.getContext(`2d`);

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

export function renderNeuralNetwork(evolutionaryAlgorithm, snake) {
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
  const neuralNetwork = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie];
  // Render weights.
  for (let i = 0; i < neuralNetwork.weights.length; i++) {
    const layer1Size = neuralNetwork.layers[i].numRows;
    for (let j = 0; j < layer1Size; j++) {
      const layer2Size = neuralNetwork.layers[i + 1].numRows;
      for (let k = 0; k < layer2Size; k++) {
        CONTEXT_NEURAL_NETWORK.beginPath();
        CONTEXT_NEURAL_NETWORK.moveTo(canvasSize*((i+1)/(neuralNetwork.layers.length + 1)), canvasSize/(layer1Size + 1)*(j + 1));
        CONTEXT_NEURAL_NETWORK.lineTo(canvasSize*((i+2)/(neuralNetwork.layers.length + 1)), canvasSize/(layer2Size + 1)*(k + 1));
        CONTEXT_NEURAL_NETWORK.closePath();
        const intensity = neuralNetwork.layers[i].elements[j][0];
        if (neuralNetwork.weights[i].elements[k][j] < 0) {
          CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 0, 0, ${intensity})`;
        } else {
          CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(0, 0, 255, ${intensity})`;
        }
        CONTEXT_NEURAL_NETWORK.stroke();
      }
    }
  }
  // Render nodes.
  for (let i = 0; i < neuralNetwork.layers.length; i++) {
    const layerSize = neuralNetwork.layers[i].numRows;
    for (let j = 0; j < layerSize; j++) {
      const intensity = neuralNetwork.layers[i].elements[j][0] * 255;
      CONTEXT_NEURAL_NETWORK.beginPath();
      CONTEXT_NEURAL_NETWORK.arc(canvasSize*((i+1)/(neuralNetwork.layers.length + 1)), canvasSize/(layerSize + 1)*(j + 1), 8, 0, 2*Math.PI);
      CONTEXT_NEURAL_NETWORK.closePath();
      CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
      CONTEXT_NEURAL_NETWORK.lineWidth = 1;
      CONTEXT_NEURAL_NETWORK.stroke();
      const outputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie]
        .layers[evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].layers.length - 1].elements;
      const outputLayerDirections = [
        {index: 0, intensity: outputLayer[0][0]},
        {index: 1, intensity: outputLayer[1][0]},
        {index: 2, intensity: outputLayer[2][0]},
        {index: 3, intensity: outputLayer[3][0]}
      ];
      outputLayerDirections.sort((a, b) => { return b.intensity - a.intensity; });
      if (i === neuralNetwork.layers.length - 1 && j === outputLayerDirections[0].index) {
        CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, 0, 0)`;
      } else {
        CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
      }
      CONTEXT_NEURAL_NETWORK.fill();
    }
  }
  // Render labels.
  const DIRECTIONS = [
    `Up-Left`,
    `Left`,
    `Down-Left`,
    `Up`,
    `Down`,
    `Up-Right`,
    `Right`,
    `Down-Right`
  ];
  const DETECTORS = [
    `Wall`,
    `Body`,
    `Fruit`
  ];
  for (let i = 0; i < DIRECTIONS.length; i++) {
    for (let j = 0; j < DETECTORS.length; j++) {
      CONTEXT_NEURAL_NETWORK.font = `12px Arial`;
      CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
      CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(255, 255, 255)`;
      CONTEXT_NEURAL_NETWORK.textAlign = `right`;
      CONTEXT_NEURAL_NETWORK.textBaseline = `middle`;
      CONTEXT_NEURAL_NETWORK.fillText(`${DIRECTIONS[i]} ${DETECTORS[j]}`, -16 + canvasSize*((1)/(neuralNetwork.layers.length + 1)), canvasSize/(28 + 1)*((3*i + j) + 1));
    }
  }
  const OUTPUT_NODE_LABELS = [`Left`, `Up`, `Right`, `Down`];
  for (let i = 24; i < 28; i++) {
    CONTEXT_NEURAL_NETWORK.fillText(OUTPUT_NODE_LABELS[i%4], -16 + canvasSize*((1)/(neuralNetwork.layers.length + 1)), canvasSize/(28 + 1)*((i) + 1));
  }
  for (let i = 0; i < 4; i++) {
    CONTEXT_NEURAL_NETWORK.font = `12px Arial`;
    CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
    CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(255, 255, 255)`;
    CONTEXT_NEURAL_NETWORK.textAlign = `start`;
    CONTEXT_NEURAL_NETWORK.textBaseline = `middle`;
    CONTEXT_NEURAL_NETWORK.fillText(OUTPUT_NODE_LABELS[i], 16 + canvasSize*((neuralNetwork.layers.length)/(neuralNetwork.layers.length + 1)), canvasSize/(4 + 1)*(i + 1));
  }
  alert();
}
