"use strict";

import {updateInputLayer, getDirectionFromOutputLayer, renderNeuralNetwork} from "./Artificial-Intelligence-Controller.js";
import {EvolutionaryAlgorithm} from "./EvolutionaryAlgorithm.js";
import {Snake} from "../../scripts/Snake.js";
import {Pellet} from "../../scripts/Pellet.js";

const BUTTON_TOGGLE_SHOW_TRAINING = document.getElementById(`button-toggle-show-training`);
const SPAN_GEN_SPECIE = document.getElementById(`span-gen-specie`);
const CANVAS_GAME = document.getElementById(`canvas-game`);
const CONTEXT_GAME = CANVAS_GAME.getContext(`2d`);
const CANVAS_NEURAL_NETWORK = document.getElementById(`canvas-neural-network`);
const CONTEXT_NEURAL_NETWORK = CANVAS_NEURAL_NETWORK.getContext(`2d`);

const MILLISECONDS_PER_SECOND = 1000;
const FRAMES_PER_SECOND = 10;
export const GRID_SIZE = 30;

const snake = new Snake();
const pellet = new Pellet();
const evolutionaryAlgorithm = new EvolutionaryAlgorithm(2000, 28, 16, 4);

export let canvasSize = 600;
CANVAS_GAME.width = CANVAS_GAME.height = canvasSize;
CANVAS_NEURAL_NETWORK.width = CANVAS_NEURAL_NETWORK.height = 600;

let showTraining = true;
let started = false;
let hunger;
let apples;
let steps;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

BUTTON_TOGGLE_SHOW_TRAINING.addEventListener(`click`, () => {
  showTraining = !showTraining;
  CONTEXT_GAME.clearRect(0, 0, canvasSize, canvasSize);
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
});

async function learningLoop() {
  await reset();
  while (await gameLoop());
  window.setTimeout(learningLoop); // Keeps the browser from freezing.
}

async function reset() {
  // Runs the first time.
  if (started) {
    evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness = steps + (Math.pow(2, apples) + Math.pow(apples, 2.1) * 500) - (Math.pow(apples, 1.2) * Math.pow(0.25 * steps, 1.3));
    // evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].fitness = steps + Math.pow(apples, 2) + Math.pow(2, apples);
    // console.log(evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie]);
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
    window.requestAnimationFrame(() => {
      render();
      renderNeuralNetwork(evolutionaryAlgorithm);
    });
    await sleep(MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
}

async function gameLoop() {
  updateInputLayer(evolutionaryAlgorithm, snake, pellet);
  evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].calculateOutputs();
  snake.direction = getDirectionFromOutputLayer(evolutionaryAlgorithm, snake);
  snake.move();
  if (snake.checkCollison(GRID_SIZE) || ++hunger === 250) {
    if (showTraining) {
      window.requestAnimationFrame(() => {
        render();
        renderNeuralNetwork(evolutionaryAlgorithm);
      });
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
    window.requestAnimationFrame(() => {
      render();
      renderNeuralNetwork(evolutionaryAlgorithm);
    });
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
  alert();
}
