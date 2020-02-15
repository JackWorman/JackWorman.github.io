"use strict";

import {updateInputLayer, getDirectionFromOutputLayer} from "./Artificial-Intelligence-Controller.js";
import {renderNeuralNetwork} from "./NeuralNetworkCanvas.js";
import {renderGraph} from "./GraphCanvas.js";
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
const PAUSE_INTERVAL = 50;
// EA Settings
let POPULATION_SIZE = 280;
let LAYER_SIZES = [28, 20, 12, 4];
let MUTATION_RATE = 0.1;
let ELITISM_RATE = 0.01;
let testsPerAgentPerGeneration = 1;
const MAX_HUNGER = GRID_SIZE*GRID_SIZE;

const snake = new Snake();
const pellet = new Pellet();
export let evolutionaryAlgorithm;

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = canvasSize;
CANVAS_GRAPH.width = CANVAS_GRAPH.height = canvasSize;

let showTraining = true;
let started = false;
let hunger;
let apples;
//export let bestFitnesses = [];
let showMode = `all`;
let snakeCopies = [];
let previousTime = performance.now();

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
  while (true) {
    setUpNextGeneration();
    if (evolutionaryAlgorithm.bestFitnesses.length > 0) {
      testsPerAgentPerGeneration = Math.max(1, Math.round(Math.sqrt(Math.max(...evolutionaryAlgorithm.bestFitnesses))));
    }
    for (let test = 0; test < testsPerAgentPerGeneration; test++) {
      resetGame(test);
      do {
        await render(test);
      } while (await gameLoop());
      evolutionaryAlgorithm.evaluateFitness(apples);
      // Clears canvases after showing best snake.
      if (showMode === `best` && evolutionaryAlgorithm.specie === 0 && test === 0) {
        CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
        CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
      }
      SPAN_GEN_SPECIE.textContent =
        `Generation: ${evolutionaryAlgorithm.generation},
        Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE},
        Test: ${test + 1}/${testsPerAgentPerGeneration}`;
    }
    // download(`testDownload`, JSON.stringify(evolutionaryAlgorithm));
    // alert();
  }
}

/**
 * Gets the evolutionary algorithm set up for the next generation.
 *
 * TODO: move to EvolutionaryAlgorithm.js ???
 */
function setUpNextGeneration() {
  if (started) {
    evolutionaryAlgorithm.specie++;
    if (evolutionaryAlgorithm.specie === POPULATION_SIZE) {
      evolutionaryAlgorithm.sort();
      evolutionaryAlgorithm.bestFitnesses.push(evolutionaryAlgorithm.neuralNetworks[0].fitness/testsPerAgentPerGeneration);
      renderGraph();
      // evolutionaryAlgorithm.calculateDiversity();
      evolutionaryAlgorithm.selectParentsViaRouletteWheel();
      // evolutionaryAlgorithm.selectParentsViaRank();
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
      Test: 1/${testsPerAgentPerGeneration}`;
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
async function gameLoop() {
  // Pauses the loop ever once in a while, so that the browser does not crash.
  if (performance.now() - previousTime > PAUSE_INTERVAL) {
    await sleep(0);
    previousTime = performance.now();
  }
  updateInputLayer(evolutionaryAlgorithm, snake, pellet);
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].propagateForward();
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
      Test: ${test + 1}/${testsPerAgentPerGeneration}`;
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

document.querySelectorAll(`input[name=view-mode]`).forEach(element => element.addEventListener(`change`, async () => {
  showMode = document.querySelector(`input[name=view-mode]:checked`).value;
  await sleep(0); // Pauses to ensure the canvases do not get overwritten after being cleared.
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
}));

document.getElementById(`button-start`).addEventListener(`click`, function testFunc() {
  POPULATION_SIZE = Number.parseInt(document.getElementsByName(`population-size`)[0].value);
  const hiddenLayers = document.getElementsByName(`hidden-layer-sizes`)[0].value.replace(/\s+/g, ``).split(`,`).map(x => Number.parseInt(x));
  LAYER_SIZES = [28, ...hiddenLayers, 4];
  MUTATION_RATE = Number.parseFloat(document.getElementsByName(`mutation-rate`)[0].value)/100;
  ELITISM_RATE = Number.parseFloat(document.getElementsByName(`elitism-rate`)[0].value)/100;
  testsPerAgentPerGeneration =  Number.parseInt(document.getElementsByName(`tests`)[0].value);

  if (
    POPULATION_SIZE < 1
    || LAYER_SIZES.some(x => isNaN(x)) || LAYER_SIZES.some(x => x < 1)
    || MUTATION_RATE < 0 || MUTATION_RATE > 1
    || ELITISM_RATE < 0 || ELITISM_RATE > 1
    || testsPerAgentPerGeneration < 0
  ) {
    alert(`Error: One or more invalid inputs.`);
    return;
  }
  // Removes the listener, so that the function can only be called once.
  document.getElementById(`button-start`).removeEventListener(`click`, testFunc, false);

  document.getElementById(`div-settings-container`).style.display = `none`;
  document.getElementById(`div-tester`).style.display = `block`;
  evolutionaryAlgorithm = new EvolutionaryAlgorithm(POPULATION_SIZE, LAYER_SIZES, MUTATION_RATE, ELITISM_RATE);
  evolutionaryAlgorithmLoop();
});

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = x => resolve(fr.result);
    fr.readAsText(file);
})}

async function loadFile(file) {
  let text = await file.text();
  console.log(text);
}

document.getElementById(`input-file`).addEventListener(`change`, async function blah(file) {
  console.log(file);
  let text = await file.text();
  console.log(text);
});
