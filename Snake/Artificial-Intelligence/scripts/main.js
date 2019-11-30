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

const MILLISECONDS_PER_SECOND = 1000;

// Settings
const FRAMES_PER_SECOND = 15;
export const GRID_SIZE = 30;
const POPULATION_SIZE = 2000;
const LAYER_SIZES = [28, 20, 12, 4];
const MUTATION_RATE = 0.02;
const ELITISM_RATE = 0.025;
const ROUNDS_PER_AGENT_PER_GENERATION = 10;
const MAX_HUNGER = 900;

const snake = new Snake();
const pellet = new Pellet();
const evolutionaryAlgorithm = new EvolutionaryAlgorithm(POPULATION_SIZE, LAYER_SIZES, MUTATION_RATE, ELITISM_RATE);

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = 600;

let showTraining = true;
let showBest = true;
let started = false;
let hunger;
let apples;
let steps;
let bestFitnesses = [];

let showMode = `all`;

let canvasCleared = true;

let round = 0;
let snakeCopies = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

BUTTON_TOGGLE_SHOW.addEventListener(`click`, () => {
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
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
});

async function learningLoop() {
  if (started) {
    evolutionaryAlgorithm.specie++;
    SPAN_GEN_SPECIE.textContent = `Generation: ${evolutionaryAlgorithm.generation}, Species: ${evolutionaryAlgorithm.specie + 1}/${POPULATION_SIZE}`;
    if (evolutionaryAlgorithm.specie === POPULATION_SIZE) {
      evolutionaryAlgorithm.specie = 0;
      evolutionaryAlgorithm.generation++;

      evolutionaryAlgorithm.sort();
      bestFitnesses.push(evolutionaryAlgorithm.neuralNetworks[0].fitness);
      console.log(`==============================`);
      console.log(`Generation: ${evolutionaryAlgorithm.generation}`);
      console.log(`Best Fitness: ${Math.round(evolutionaryAlgorithm.neuralNetworks[0].fitness)}`);
      console.log(`Average Best Fitness: ${Math.round(bestFitnesses.reduce((a, b) => a + b, 0) / bestFitnesses.length)}`);
      evolutionaryAlgorithm.selectParents();
      evolutionaryAlgorithm.crossover();
      evolutionaryAlgorithm.mutate();
      evolutionaryAlgorithm.elitism();
      evolutionaryAlgorithm.clearFitness();
    }
  } else {
    started = true;
    evolutionaryAlgorithm.initialize();
  }
  for (let i = 0; i < ROUNDS_PER_AGENT_PER_GENERATION; i++) {
    reset();
    do {
      if (showMode === `all` || (showMode === `best` && evolutionaryAlgorithm.specie === 0)) {
        canvasCleared = false;
        window.requestAnimationFrame(() => {
          render();
          renderNeuralNetwork(evolutionaryAlgorithm, snake);
        });
        await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
      }
    } while (gameLoop());
    evolutionaryAlgorithm.evaluateFitness(apples, steps);
  }
  if (!canvasCleared) {
    canvasCleared = true;
    CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
    CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
  }
  window.setTimeout(learningLoop); // Keeps the browser from freezing.
}

function reset() {
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  hunger = 0;
  apples = 0;
  steps = 0;
  snakeCopies = [];
}

function gameLoop() {
  updateInputLayer(evolutionaryAlgorithm, snake, pellet);
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].calculateOutputs();
  snake.direction = getDirectionFromOutputLayer(evolutionaryAlgorithm, snake);
  snake.move();
  steps++;
  hunger++;
  if (snake.checkPelletEaten(pellet)) {
    apples++;
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake.bodySegments);
    hunger = 0;
    snakeCopies = [];
  }

  let newSnakeCopy = [];
  for (const body of snake.bodySegments) {
    newSnakeCopy.push({x: body.x, y: body.y});
  }
  let snakesMatch = false;
  for (const snakeCopy of snakeCopies) {
    snakesMatch = true;
    for (let i = 0; i < newSnakeCopy.length; i++) {
      if (newSnakeCopy[i].x !== snakeCopy[i].x || newSnakeCopy[i].y !== snakeCopy[i].y) {
        snakesMatch = false;
        break;
      }
    }
    if (snakesMatch) {
      break;
    }
  }
  snakeCopies.push(newSnakeCopy);

  return !(snake.checkCollison(GRID_SIZE) || hunger === MAX_HUNGER || snakesMatch);
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

window.addEventListener(`load`, learningLoop);
