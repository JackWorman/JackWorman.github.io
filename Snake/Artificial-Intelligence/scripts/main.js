"use strict";

import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import {Snake} from "../../scripts/Snake.js";
import {Pellet} from "../../scripts/Pellet.js";

const BUTTON_TOGGLE_SHOW_TRAINING = document.getElementById(`button-toggle-show-training`);
const SPAN_GEN_SPECIE = document.getElementById(`span-gen-specie`);
const CANVAS_GAME = document.getElementById(`canvas-game`);
const CONTEXT_GAME = CANVAS_GAME.getContext(`2d`);

const FRAMES_PER_SECOND = 10;
const MILLISECONDS_PER_SECOND = 1000;

const GRID_SIZE = 30;
const snake = new Snake();
const pellet = new Pellet();
const evolutionaryAlgorithm = new EvolutionaryAlgorithm(2000, 28, 16, 4);

let started = false;
let showTraining = true;
let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
let hunger;
let apples;
let steps;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

BUTTON_TOGGLE_SHOW_TRAINING.addEventListener(`click`, () => {
  showTraining = !showTraining;
});

async function learningLoop() {
  await reset();
  while (await gameLoop());
  window.setTimeout(learningLoop); // Keeps the browser from freezing.
}

async function reset() {
  // Runs the first time.
  if (started) {
    // evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness = steps + (Math.pow(2, apples) + Math.pow(apples, 2.1) * 500) - (Math.pow(apples, 1.2) * Math.pow(0.25 * steps, 1.3));
    evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness = steps + Math.pow(apples, 2) + Math.pow(2, apples);
    evolutionaryAlgorithm.specie++;
    if (evolutionaryAlgorithm.specie === 2000) {
      evolutionaryAlgorithm.specie = 0;
      evolutionaryAlgorithm.generation++;

      evolutionaryAlgorithm.sort();
      console.log(`==============================`);
      console.log(`Generation: ${evolutionaryAlgorithm.generation}`);
      console.log(`Best Fitness: ${evolutionaryAlgorithm.neuralNetworks[0].fitness}`);
      evolutionaryAlgorithm.proportionalSelectionMutate();
    }
  } else {
    started = true;
    evolutionaryAlgorithm.initialize();
  }
  SPAN_GEN_SPECIE.textContent = `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie + 1}/2000`;
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  hunger = 0;
  apples = 0;
  steps = 0;

  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness = 0;

  if (showTraining) {
    window.requestAnimationFrame(render);
    await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
}

async function gameLoop() {
  updateInputLayer();
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].calculateOutputs();
  snake.direction = getDirectionFromOutputLayer();
  snake.move();
  if (snake.checkCollison(GRID_SIZE) || ++hunger === 250) {
    if (showTraining) {
      window.requestAnimationFrame(render);
      await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
    }
    return false;
  }
  steps++;
  if (snake.checkPelletEaten(pellet)) {
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake.bodySegments);
    hunger = 0;
    apples++;
  }
  if (showTraining) {
    window.requestAnimationFrame(render);
    await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
  return true;
}

function render() {
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  const fillSquare = (x, y, color) => {
    CONTEXT_GAME.fillStyle = color;
    const squareLength = canvasSize / GRID_SIZE;
    CONTEXT_GAME.fillRect(x * squareLength + 0.5, y * squareLength + 0.5, squareLength, squareLength);
  }
  pellet.render(fillSquare);
  snake.render(fillSquare);
}

function updateInputLayer() {
  const inputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].i.elements;
  // Distance from wall, body, and fruit nodes.
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        inputLayer[count++][0] = detectWall(x, y);
        inputLayer[count++][0] = detectBody(x, y);
        inputLayer[count++][0] = detectFruit(x, y);
      }
    }
  }
  // Current direction nodes.
  inputLayer[24][0] = (snake.direction === `left`  ? 1 : 0);
  inputLayer[25][0] = (snake.direction === `up`    ? 1 : 0);
  inputLayer[26][0] = (snake.direction === `right` ? 1 : 0);
  inputLayer[27][0] = (snake.direction === `down`  ? 1 : 0);
}

function detectWall(horizontal, vertical) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {
      x: snake.bodySegments[0].x + count * horizontal,
      y: snake.bodySegments[0].y + count * vertical
    };
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      return 1 - (count - 1) / (GRID_SIZE - 1);
    }
  }
}

function detectBody(horizontal, vertical) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {
      x: snake.bodySegments[0].x + count * horizontal,
      y: snake.bodySegments[0].y + count * vertical
    };
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

function detectFruit(horizontal, vertical) {
  let count = 0;
  while (true) {
    count++;
    const testPoint = {
      x: snake.bodySegments[0].x + count * horizontal,
      y: snake.bodySegments[0].y + count * vertical
    };
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

function getDirectionFromOutputLayer() {
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

window.addEventListener(`load`, learningLoop);

function showInputLayer() {
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
  const inputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].i.elements;
  console.log(`====================`);
  for (let i = 0; i < DIRECTIONS.length; i++) {
    console.log(`***${DIRECTIONS[i]}***`);
    for (let j = 0; j < 3; j++) {
      console.log(`${DETECTORS[j]}: ${inputLayer[3*i + j][0]}`);
    }
  }
}
