"use strict";

import {updateInputLayer, getDirectionFromOutputLayer, renderNeuralNetwork} from "./Artificial-Intelligence-Controller.js";
import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import {Snake} from "../../scripts/Snake.js";
import {Pellet} from "../../scripts/Pellet.js";

const SELECT_VIEW_SETTINGS = document.getElementById(`select-view-settings`);
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
const PAUSE_TIME = 50;
// EA Settings
const POPULATION_SIZE = 280;
const LAYER_SIZES = [28, 20, 12, 4];
const MUTATION_RATE = 0.02;
const ELITISM_RATE = 0.01;
const TESTS_PER_AGENT_PER_GENERATION = 50;
const MAX_HUNGER = GRID_SIZE*GRID_SIZE;

const snake = new Snake();
const pellet = new Pellet();
const evolutionaryAlgorithm = new EvolutionaryAlgorithm(POPULATION_SIZE, LAYER_SIZES, MUTATION_RATE, ELITISM_RATE);

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = canvasSize;
CANVAS_GRAPH.width = CANVAS_GRAPH.height = canvasSize;

let showTraining = true;
let started = false;
let hunger;
let apples;
let bestFitnesses = [];
let showMode = `all`;
let snakeCopies = [];

/**
 * Pauses the execution of a function for a given amount of milliseconds. This allows other operations to be performed
 * in the mean time.
 *
 * Note: The time asleep will likely be longer then the specified duration because the function will be placed at the
 *       end of the execution queue once the timeout ends.
 *
 * @param  {Number}  milliseconds
 * @return {Promise}
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
    for (let test = 0; test < TESTS_PER_AGENT_PER_GENERATION; test++) {
      resetGame(test);
      do {
        await render(test);
      } while (gameLoop());
      evolutionaryAlgorithm.evaluateFitness(apples);
      // Clears canvases after showing best snake.
      if (showMode === `best` && evolutionaryAlgorithm.specie === 0 && test === 0) {
        CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
        CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
      }
      SPAN_GEN_SPECIE.textContent =
        `Generation: ${evolutionaryAlgorithm.generation},
        Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE},
        Test: ${test + 1}/${TESTS_PER_AGENT_PER_GENERATION}`;
      // Pauses the loop ever once in a while, so that the browser does not crash.
      if (performance.now() - previousTime > PAUSE_TIME) {
        await sleep(0);
        previousTime = performance.now();
      }
    }
  }
}

/**
 * Gets the evolutionary algorithm set up for the next generation.
 *
 * TODO: change name to setUpNextGeneration()
 */
function resetEA() {
  if (started) {
    evolutionaryAlgorithm.specie++;
    if (evolutionaryAlgorithm.specie === POPULATION_SIZE) {
      evolutionaryAlgorithm.sort();
      bestFitnesses.push(evolutionaryAlgorithm.neuralNetworks[0].fitness);
      renderGraph();
      evolutionaryAlgorithm.selectParents();
      evolutionaryAlgorithm.crossover();
      evolutionaryAlgorithm.mutate();
      evolutionaryAlgorithm.elitism();
      evolutionaryAlgorithm.clearFitness();
      evolutionaryAlgorithm.specie = 0;
      evolutionaryAlgorithm.generation++;
    }
    SPAN_GEN_SPECIE.textContent =
      `Generation: ${evolutionaryAlgorithm.generation},
      Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE},
      Test: 1/${TESTS_PER_AGENT_PER_GENERATION}`;
  } else {
    started = true;
    renderGraph();
    evolutionaryAlgorithm.initialize();
  }
  apples = 0;
}

/**
 * Gets set up for the next game to start.
 */
function resetGame() {
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  hunger = 0;
  snakeCopies = [];
  apples = 0;
}

/**
 * Processes one move in the game.
 *
 * @return {Boolean} true = snake is alive, false = snake is dead
 */
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

/**
 * Checks if the position the snake is in currently matches any previous positions it has been in since the last apple
 * it has collected. This is used to kill snakes if they get caught in a loop.
 *
 * @return {Boolean} true = repeated position, false = unqiue position
 */
function checkRepeatedPosition() {
  const newSnakeCopy = [];
  for (const body of snake.bodySegments) {
    newSnakeCopy.push({x: body.x, y: body.y});
  }
  let snakesMatch;
  // Iterate over all previous snake positions.
  for (const snakeCopy of snakeCopies) {
    snakesMatch = true;
    // Check each body part of the current snake against the respective body part of the copy.
    for (let i = 0; i < newSnakeCopy.length; i++) {
      if (newSnakeCopy[i].x !== snakeCopy[i].x || newSnakeCopy[i].y !== snakeCopy[i].y) {
        snakesMatch = false;
        break; // One difference is all that is needed to confirm uniqueness.
      }
    }
    if (snakesMatch) {
      return true;
    }
  }
  snakeCopies.push(newSnakeCopy);
  return false;
}

/**
 * Renders the current frame of the game and neural network onto their respective canvases.
 *
 * @param  {Number} test The test number of the specie being tested currently.
 */
async function render(test) {
  if (showMode === `all` || (showMode === `best` && evolutionaryAlgorithm.specie === 0 && test === 0)) {
    SPAN_GEN_SPECIE.textContent =
      `Generation: ${evolutionaryAlgorithm.generation},
      Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE},
      Test: ${test + 1}/${TESTS_PER_AGENT_PER_GENERATION}`;
    window.requestAnimationFrame(() => {
      renderGame();
      renderNeuralNetwork(evolutionaryAlgorithm, snake);
    });
    await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
}

/**
 * Renders the current frame of the game.
 */
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

SELECT_VIEW_SETTINGS.addEventListener(`change`, async () => {
  showMode = SELECT_VIEW_SETTINGS.value;
  await sleep(0); // Pauses to ensure the canvases do not get overwritten after being cleared.
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
});

window.addEventListener(`load`, evolutionaryAlgorithmLoop);


////////////////////
//////////////////// Move to own module
////////////////////

CANVAS_GRAPH.addEventListener(`mouseout`, (event) => {
  renderGraph();
});

CANVAS_GRAPH.addEventListener(`mousemove`, (event) => {
  if (bestFitnesses.length < 2) return;
  const maxFitness = Math.max(...bestFitnesses);
  const mousePos = CANVAS_GRAPH.relMouseCoords(event);

  const hoverXOffset = canvasSize*1/(bestFitnesses.length - 1)/2;
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
      CONTEXT_GRAPH.strokeStyle = `rgb(255, 0, 0)`;
      CONTEXT_GRAPH.stroke();
      // Draws the coordinate.
      let xOffset = (x < canvasSize/2) ? 5 : -5;
      CONTEXT_GRAPH.textAlign = (x < canvasSize/2) ? `left` : `right`;
      let yOffset = (y < canvasSize/2) ? 12 : -12;
      CONTEXT_GRAPH.fillStyle = `rgb(255, 0, 0)`;
      CONTEXT_GRAPH.font = `bold 14px Arial`;
      CONTEXT_GRAPH.fillText(`(${i}, ${bestFitnesses[i]})`, x + xOffset, y + yOffset);
      break;
    }
  }
});

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

function renderGraph() {
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
  CONTEXT_GRAPH.fillText(`Overall Best Fitness: ${maxFitness.toLocaleString()}`, 10, 40);
  if (bestFitnesses.length === 1) return;

  CONTEXT_GRAPH.beginPath();
  CONTEXT_GRAPH.moveTo(0, canvasSize - canvasSize*bestFitnesses[0]/maxFitness);
  for (let i = 1; i < bestFitnesses.length; i++) {
    CONTEXT_GRAPH.lineTo(canvasSize*i/(bestFitnesses.length - 1), canvasSize - canvasSize*bestFitnesses[i]/maxFitness);
  }
  CONTEXT_GRAPH.strokeStyle = WHITE;
  CONTEXT_GRAPH.stroke();
}
