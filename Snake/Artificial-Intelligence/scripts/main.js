"use strict";

import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import {Snake} from "../../scripts/Snake.js";
import {Pellet} from "../../scripts/Pellet.js";

const SPAN_GEN_SPECIE = document.getElementById(`span-gen-specie`);
const CANVAS_GAME = document.getElementById(`canvas-game`);
const CONTEXT_GAME = CANVAS_GAME.getContext(`2d`);
const GRID_SIZE = 30;
const FRAMES_PER_SECOND = 15;
const MILLISECONDS_PER_SECOND = 1000;

let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;

const snake = new Snake();
const pellet = new Pellet();
let distanceTraveled;
let smallestDistancePossible;

let evolutionaryAlgorithm = new EvolutionaryAlgorithm(2000, 28, 16, 4);
evolutionaryAlgorithm.initializeAllNeuralNetworks();

let started = false;

function learningLoop() {
  reset();
  while (gameLoop());
  window.setTimeout(learningLoop);
}

function reset() {
  // Runs the first time.
  if (!started) {
    started = true;
    // await Swal.fire(`Start training:`);
  // Does not run the first time.
  } else {
    evolutionaryAlgorithm.specie++;
    if (evolutionaryAlgorithm.specie === 2000) {
      evolutionaryAlgorithm.sort();
      evolutionaryAlgorithm.mutate();

      console.log(`==============================`);
      console.log(`Generation: ${evolutionaryAlgorithm.generation}`);
      console.log(`Best Fitness: ${evolutionaryAlgorithm.neuralNetworks[0].fitness}`);

      evolutionaryAlgorithm.specie = 0;
      evolutionaryAlgorithm.generation++;
      evolutionaryAlgorithm.clearFitness();
      // if (evolutionaryAlgorithm.generation % 10000 === 0) {
      //   alert(`Generation done.`);
      // }
    }
  }
  SPAN_GEN_SPECIE.textContent = `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie}/1999`;
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(pellet.x - snake.bodySegments[0].x) + Math.abs(pellet.y - snake.bodySegments[0].y);
}

function gameLoop() {
  updateInputLayer();
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].calculateOutputs();
  snake.direction = getDirectionFromOutputLayer();
  snake.move();
  if (snake.checkCollison(GRID_SIZE) || ++distanceTraveled >= 250) {
    return false;
  }
  if (snake.checkPelletEaten(pellet)) {
    evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness += 10;
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake.bodySegments);
    distanceTraveled = 0;
  }
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness += 1;
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
    const testPoint = {x: snake.bodySegments[0].x + count * horizontal, y: snake.bodySegments[0].y + count * vertical};
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      return 1 - count / GRID_SIZE;
    }
  }
}

function detectBody(horizontal, vertical) {
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
        return 1 - count / GRID_SIZE;
      }
    }
  }
}

function detectFruit(horizontal, vertical) {
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
      return 1 - count / GRID_SIZE;
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
