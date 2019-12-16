"use strict";

import {updateInputLayer, getDirectionFromOutputLayer, renderNeuralNetwork} from "./Artificial-Intelligence-Controller.js";
import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import {Snake} from "../../scripts/Snake.js";
import {Pellet} from "../../scripts/Pellet.js";

const BUTTON_TOGGLE_SHOW = document.getElementById(`button-toggle-show`);
const SPAN_GEN_SPECIE = document.getElementById(`span-gen-specie`);
const CANVAS_GAME = document.getElementById(`canvas-game`);
const CONTEXT_GAME = CANVAS_GAME.getContext(`2d`);
const CANVAS_NEURAL_NETWORK = document.getElementById(`canvas-neural-network`);
const CONTEXT_NEURAL_NETWORK = CANVAS_NEURAL_NETWORK.getContext(`2d`);
const CANVAS_GRAPH = document.getElementById(`canvas-graph`);
const CONTEXT_GRAPH = CANVAS_GRAPH.getContext(`2d`);

const MILLISECONDS_PER_SECOND = 1000;

// Game Settings
const FRAMES_PER_SECOND = 15;
export const GRID_SIZE = 30;
// EA Settings
const POPULATION_SIZE = 280;
const LAYER_SIZES = [28, 22, 16, 10, 4];
const MUTATION_RATE = 0.02;
const ELITISM_RATE = 0.01;
const ROUNDS_PER_AGENT_PER_GENERATION = 50;
const MAX_HUNGER = GRID_SIZE*GRID_SIZE;

const snake = new Snake();
const pellet = new Pellet();
const evolutionaryAlgorithm = new EvolutionaryAlgorithm(POPULATION_SIZE, LAYER_SIZES, MUTATION_RATE, ELITISM_RATE);

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = canvasSize;
CANVAS_GRAPH.width = CANVAS_GRAPH.height = canvasSize;

let showTraining = true;
let showBest = true;
let started = false;
let hunger;
let apples;
let bestFitnesses = [];
let showMode = `all`;
let snakeCopies = [];

let pauseTime = 100;
let setUserInactiveTimeout;

/**
 * Pauses the execution of a function for a given amount of milliseconds. This allows other operations to be performed
 * in the mean time.
 *
 * Note: The time asleep will likely be longer then the specified duration because the function will be placed at the
 *       end of the exectuion queue once the timeout ends.
 */
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Learning loop.
 */
async function evolutionaryAlgorithmLoop() {
  let previousTime = performance.now();
  while (true) {
    resetEA();
    for (let round = 0; round < ROUNDS_PER_AGENT_PER_GENERATION; round++) {
      resetGame(round);
      do {
        await render(round);
      } while (gameLoop());
      evolutionaryAlgorithm.evaluateFitness(apples);
      // Clear canvas after showing best snake.
      if (showMode === `best` && evolutionaryAlgorithm.specie === 0 && round === 0) {
        CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
        CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
      }
      SPAN_GEN_SPECIE.textContent = `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE}, Test: ${round}/${ROUNDS_PER_AGENT_PER_GENERATION}`;
      // Pauses the loop every 333ms, so that the browser does not crash.
      if (performance.now() - previousTime > pauseTime) {
        await sleep(0);
        previousTime = performance.now();
      }
    }
  }
}

/**
 * Ran when a generation ends.
 */
function resetEA() {
  if (started) {
    evolutionaryAlgorithm.specie++;
    if (evolutionaryAlgorithm.specie === POPULATION_SIZE) {
      evolutionaryAlgorithm.sort();
      bestFitnesses.push(evolutionaryAlgorithm.neuralNetworks[0].fitness);
      console.log(`==============================`);
      console.log(`Generation: ${evolutionaryAlgorithm.generation}`);
      console.log(`Best Fitness: ${Number(Math.round(evolutionaryAlgorithm.neuralNetworks[0].fitness)).toLocaleString()}`);
      console.log(`Average Best Fitness: ${Number(Math.round(bestFitnesses.reduce((a, b) => a + b, 0) / bestFitnesses.length)).toLocaleString()}`);
      evolutionaryAlgorithm.selectParents();
      evolutionaryAlgorithm.crossover();
      evolutionaryAlgorithm.mutate();
      evolutionaryAlgorithm.elitism();
      evolutionaryAlgorithm.clearFitness();
      evolutionaryAlgorithm.specie = 0;
      evolutionaryAlgorithm.generation++;
    }
    SPAN_GEN_SPECIE.textContent = `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE}, Test: 1/${ROUNDS_PER_AGENT_PER_GENERATION}`;
    renderGraph();
  } else {
    started = true;
    evolutionaryAlgorithm.initialize();
  }
  apples = 0;
}

function resetGame() {
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  hunger = 0;
  snakeCopies = [];
  apples = 0;
}

function gameLoop() {
  updateInputLayer(evolutionaryAlgorithm, snake, pellet);
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].calculateOutputs();
  snake.direction = getDirectionFromOutputLayer(evolutionaryAlgorithm, snake);
  snake.move();
  hunger++;
  if (snake.checkPelletEaten(pellet)) {
    apples++;
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake.bodySegments);
    hunger = 0;
    snakeCopies = [];
  }
  return !(snake.checkCollison(GRID_SIZE) || hunger === MAX_HUNGER || checkRepeatedPosition());
}

function checkRepeatedPosition() {
  const newSnakeCopy = [];
  for (const body of snake.bodySegments) {
    newSnakeCopy.push({x: body.x, y: body.y});
  }
  let snakesMatch;
  for (const snakeCopy of snakeCopies) {
    snakesMatch = true;
    for (let i = 0; i < newSnakeCopy.length; i++) {
      if (newSnakeCopy[i].x !== snakeCopy[i].x || newSnakeCopy[i].y !== snakeCopy[i].y) {
        snakesMatch = false;
        break;
      }
    }
    if (snakesMatch) {
      return true;
    }
  }
  snakeCopies.push(newSnakeCopy);
  return false;
}

async function render(round) {
  if (showMode === `all` || (showMode === `best` && evolutionaryAlgorithm.specie === 0 && round === 0)) {
    SPAN_GEN_SPECIE.textContent =
      `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE}, Test: ${round + 1}/${ROUNDS_PER_AGENT_PER_GENERATION}`;
    window.requestAnimationFrame(() => {
      renderGame();
      renderNeuralNetwork(evolutionaryAlgorithm, snake);
    });
    await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
}

function renderGame() {
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  const fillSquare = (x, y, color) => {
    CONTEXT_GAME.fillStyle = color;
    const squareLength = canvasSize / GRID_SIZE;
    CONTEXT_GAME.fillRect(x * squareLength + 0.5, y * squareLength + 0.5, squareLength, squareLength);
  }
  pellet.render(fillSquare);
  snake.render(fillSquare);
}

BUTTON_TOGGLE_SHOW.addEventListener(`click`, async () => {
  if (showMode === `all`) {
    showMode = `best`;
    BUTTON_TOGGLE_SHOW.textContent = `Showing Best`;
  } else if (showMode === `best`) {
    showMode = `off`;
    BUTTON_TOGGLE_SHOW.textContent = `Showing Off`;
  } else if (showMode === `off`) {
    showMode = `all`;
    BUTTON_TOGGLE_SHOW.textContent = `Showing All`;
  }
  await sleep(0); // Pauses to ensure the canvases do not get overwritten after being cleared.
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
});

window.addEventListener(`mousemove`, () => {
  pauseTime = 100;
  clearTimeout(setUserInactiveTimeout);
  setUserInactiveTimeout = setTimeout(() => { pauseTime = 5000; }, 60000);
});

window.addEventListener(`load`, evolutionaryAlgorithmLoop);

function renderGraph() {
  CONTEXT_GRAPH.clearRect(0, 0, canvasSize, canvasSize);
  const maxFitness = Math.max(...bestFitnesses);

  CONTEXT_GRAPH.beginPath();
  CONTEXT_GRAPH.moveTo(0, canvasSize);
  CONTEXT_GRAPH.lineTo(canvasSize*1/bestFitnesses.length, canvasSize - canvasSize*bestFitnesses[i + 1]/maxFitness);
  for (let i = 0; i < bestFitnesses.length - 1; i++) {
    CONTEXT_GRAPH.moveTo(canvasSize*(i + 1)/bestFitnesses.length, canvasSize - canvasSize*bestFitnesses[i]/maxFitness);
    CONTEXT_GRAPH.lineTo(canvasSize*(i + 2)/bestFitnesses.length, canvasSize - canvasSize*bestFitnesses[i + 1]/maxFitness);
  }
  CONTEXT_GRAPH.closePath();
  CONTEXT_GRAPH.strokeStyle = `rgb(255, 255, 255)`;
  CONTEXT_GRAPH.stroke();
}
