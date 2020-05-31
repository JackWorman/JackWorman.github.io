"use strict";

import {updateInputLayer, getDirectionFromOutputLayer} from "./Artificial-Intelligence-Controller.js";
import {renderNeuralNetwork} from "./NeuralNetworkCanvas.js";
import {renderGraph} from "./GraphCanvas.js";
import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import * as Score from "../../scripts/Score.js";
import Ship from "../../scripts/Ship.js";
import Asteroid from "../../scripts/Asteroid.js";
import {checkCollison} from "../../scripts/CollisionDetection.js";

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
const FRAMES_PER_SECOND = 30;
export const GRID_SIZE = 30;
const PAUSE_INTERVAL = 50;
// EA Settings
let POPULATION_SIZE = 280;
let LAYER_SIZES = [28, 20, 12, 4];
let MUTATION_RATE = 0.1;
let ELITISM_RATE = 0.01;
let testsPerAgentPerGeneration = 1;
const MAX_HUNGER = GRID_SIZE*GRID_SIZE;

let ship = new Ship(canvasSize/2, canvasSize/2);
let asteroids = [];
let timeOfLastAsteroidSpawn;
let scoreMultiplier = 1;
let asteroidsHit = 0;
export let evolutionaryAlgorithm;

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = canvasSize;
CANVAS_GRAPH.width = CANVAS_GRAPH.height = canvasSize;

let showTraining = true;
let started = false;
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
 async function reset() {
   ship = new Ship(canvasSize/2, canvasSize/2);
   asteroids = [];
   timeOfLastAsteroidSpawn = -ASTEROID_SPAWN_INTERVAL;
   scoreMultiplier = 1;
   asteroidsHit = 0;
   Score.reset();
   gameLoopTimeout = setTimeout(gameLoop, 0);
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
 * Processes one move in the game.
 *
 * @return {Boolean} true = ship is alive, false = ship is dead
 */
function gameLoop() {
  const deltaSeconds = 1/(FRAMES_PER_SECOND*MILLISECONDS_PER_SECOND);

  // Checks for laser expiration and laser-asteroid collisions.
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    if (ship.lasers[i].checkExpiration(currentTime)) {
      ship.lasers.splice(i, 1);
      scoreMultiplier = 1;
      continue;
    }
    for (const [index, asteroid] of asteroids.entries()) {
      if (checkCollison(ship.lasers[i].points, asteroid.points)) {
        if (asteroid.size > 0) {
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
        }
        asteroids.splice(index, 1); // Removes the element at 'index'.
        asteroidsHit++;
        Score.update(asteroidsHit*scoreMultiplier);
        scoreMultiplier++;
        ship.lasers.splice(i, 1);
        break;
      }
    }
  }

  // Checks for ship-asteroid collisions.
  for (const [index, asteroid] of asteroids.entries()) {
    if (checkCollison(ship.points, asteroid.points)) {
      if (ship.health === 0) {
        reset();
        return false;
      }
      ship.health--;
      asteroids.splice(index, 1); // Removes the asteroid that was hit.
      break;
    }
  }

  // Move all the sprites.
  const allSprites = [ship, ...ship.lasers, ...asteroids];
  for (const sprite of allSprites) {
    sprite.move(deltaSeconds, canvasSize, canvasScale);
  }

  // Spawn an asteroid every "ASTEROID_SPAWN_INTERVAL".
  if (currentTime - timeOfLastAsteroidSpawn >= ASTEROID_SPAWN_INTERVAL) {
    if (Math.random() < 0.5) {
      asteroids.push(new Asteroid(-100, (canvasSize + 200)*Math.random(), 2));
    } else {
      asteroids.push(new Asteroid((canvasSize + 200)*Math.random(), -100, 2));
    }
    timeOfLastAsteroidSpawn = currentTime;
  }

  ship.shoot(currentTime);

  return true;
}

/**
 * Renders the current frame of the game and neural network onto their respective canvases.
 *
 * @param {number} test The test number of the specie being tested currently.
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
   const CANVAS_FOREGROUND = document.getElementById(`canvas-foreground`);
   const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext(`2d`);
   CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
   const allSprites = [...ship.lasers, ...asteroids, ship];
   for (const sprite of allSprites) {
     sprite.render(CONTEXT_FOREGROUND);
   }
   CONTEXT_FOREGROUND.font = `32px VT323`;
   CONTEXT_FOREGROUND.textBaseline = `middle`;
   CONTEXT_FOREGROUND.textAlign = `center`;
   CONTEXT_FOREGROUND.fillStyle = `rgb(255, 255, 255)`;
   CONTEXT_FOREGROUND.fillText(`x${scoreMultiplier}`, 50, 50);
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
