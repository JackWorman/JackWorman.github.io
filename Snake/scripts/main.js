'use strict';

import {Snake} from './snake.js';
import {Fruit} from './fruit.js';

let FRAMES_PER_SECOND = 15;
// Constants
const CANVAS_SIZE = 690; // in pixels
const GRID_SIZE = 30;
if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
  throw 'CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.';
}
const MILLISECONDS_PER_SECOND = 1000;
const GROW_RATE = 5;
const FRUIT_COLOR = 'rgb(255, 255, 255)';
const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
];
// Keycodes
const LEFT_ARROW_KEY_CODE = 37;
const UP_ARROW_KEY_CODE = 38;
const RIGHT_ARROW_KEY_CODE = 39;
const DOWN_ARROW_KEY_CODE = 40;
const A_KEY_CODE = 65;
const W_KEY_CODE = 87;
const D_KEY_CODE = 68;
const S_KEY_CODE = 83;
// DOM Elements
const SPAN_FPS = document.getElementById('span-fps');
const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
// Globals
let directionQueue = [];
let snake;
let fruit = new Fruit();
let score = 0;
let distanceTraveled;
let smallestDistancePossible;
let controlsEnabled = false;
let loop;

// Run on load.
setUpForeground();
reset();

document.addEventListener('keydown', function(event) {
  if (!controlsEnabled
    || (event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40
    && event.keyCode !== 65 && event.keyCode !== 87 && event.keyCode !== 68 && event.keyCode !== 83)) {
    return;
  }
  // Start Game.
  if (snake.direction === 'none' && directionQueue.length === 0) {
    loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
  }
  let currentDirection = directionQueue.length ? directionQueue[directionQueue.length - 1] : snake.direction;
  if (currentDirection === 'left' || currentDirection === 'right') {
    if (event.keyCode === UP_ARROW_KEY_CODE || event.keyCode === W_KEY_CODE) {
      directionQueue.push('up');
    } else if (event.keyCode === DOWN_ARROW_KEY_CODE || event.keyCode === S_KEY_CODE) {
      directionQueue.push('down');
    }
  } else if (currentDirection === 'up' || currentDirection === 'down') {
    if (event.keyCode === LEFT_ARROW_KEY_CODE || event.keyCode === A_KEY_CODE) {
      directionQueue.push('left');
    } else if (event.keyCode === RIGHT_ARROW_KEY_CODE || event.keyCode === D_KEY_CODE) {
      directionQueue.push('right');
    }
  } else if (currentDirection === 'none') {
    if (event.keyCode === LEFT_ARROW_KEY_CODE || event.keyCode === A_KEY_CODE) {
      directionQueue.push('left');
    } else if (event.keyCode === UP_ARROW_KEY_CODE || event.keyCode === W_KEY_CODE) {
      directionQueue.push('up');
    } else if (event.keyCode === RIGHT_ARROW_KEY_CODE || event.keyCode === D_KEY_CODE) {
      directionQueue.push('right');
    } else if (event.keyCode === DOWN_ARROW_KEY_CODE || event.keyCode === S_KEY_CODE) {
      directionQueue.push('down');
    }
  }
}, true);

function setUpForeground() {
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = CANVAS_SIZE;
}

async function reset() {
  controlsEnabled = false;
  clearInterval(loop);
  if (typeof loop !== 'undefined') { // Does not run the first time.
    clearInterval(loop);
    await Swal.fire({text: 'Game Over', showConfirmButton: false, timer: 1000});
  }
  directionQueue = [];
  // Reset score variables.
  updateHighscore();
  score = 0;
  displayScore = 0;
  updateScore();
  // Setup and render foreground.
  snake = new Snake(GRID_SIZE / 2, GRID_SIZE / 2);
  fruit.placeFruit(GRID_SIZE, snake);
  // Reset distance variables.
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(fruit.x - snake.body[0].x) + Math.abs(fruit.y - snake.body[0].y);
  renderForeground();
  controlsEnabled = true;
}

let loop2;
let displayScore = 0;

function updateScore() {
  if (score === 0) {
    SPAN_SCORE.textContent = '000000000';
  } else {
    clearInterval(loop2);
    loop2 = setInterval(scoreAnimation, MILLISECONDS_PER_SECOND / 1000);
  }
}

function scoreAnimation() {
  displayScore++;

  let padding = '000000000';
  let numDigits = 0;
  while (displayScore / Math.pow(10, numDigits) >= 1) {
    numDigits++;
  }
  padding = padding.slice(0, padding.length - numDigits);
  SPAN_SCORE.textContent = padding + displayScore;

  if (displayScore === score) {
    clearInterval(loop2);
  }
}

function updateHighscore() {
  if (typeof localStorage.highscore === 'undefined') { // First time setup.
    localStorage.highscore = 0;
  }
  if (localStorage.highscore < score) {
    localStorage.highscore = score;
  }
  if (localStorage.highscore === 0) {
    SPAN_HIGHSCORE.textContent = '000000000';
  } else {
    // Calculates the amount of padding-zeros needed.
    let paddingZeros = '000000000';
    let count = 0;
    while (localStorage.highscore / Math.pow(10, count) >= 1) {
      count++
    }
    paddingZeros = paddingZeros.slice(0, paddingZeros.length - count);
    SPAN_HIGHSCORE.textContent = paddingZeros + localStorage.highscore;
  }
}

function calculateFPS() {
  if (typeof calculateFPS.deltas === 'undefined') {
    calculateFPS.deltas = new Array(FRAMES_PER_SECOND);
    calculateFPS.then = 0;
  }
  var now = performance.now();
  calculateFPS.deltas.shift();
  calculateFPS.deltas.push(now - calculateFPS.then);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / (calculateFPS.deltas.reduce((a, b) => (a + b)) / calculateFPS.deltas.length)).toFixed(2);
  calculateFPS.then = now;
}

function gameLoop() {
  calculateFPS();

  let direction = directionQueue.shift();
  if (direction) {
    snake.direction = direction;
  }
  snake.move();
  distanceTraveled++;
  if (snake.checkCollison(GRID_SIZE)) {
    reset();
    return;
  }
  if (snake.checkFruitEaten(fruit)) {
    score += Math.ceil(Math.pow(snake.body.length, 1 + smallestDistancePossible / distanceTraveled));
    updateScore();
    snake.grow();
    fruit.placeFruit(GRID_SIZE, snake);
    distanceTraveled = 0;
    smallestDistancePossible = Math.abs(fruit.x - snake.body[0].x) + Math.abs(fruit.y - snake.body[0].y);
  }
  renderForeground();
}

function renderForeground() {
  function fillSquare(x, y, color) {
    CONTEXT_FOREGROUND.fillStyle = color;
    let xStart = x * CANVAS_SIZE / GRID_SIZE + 0.5;
    let yStart = y * CANVAS_SIZE / GRID_SIZE + 0.5;
    let xLength = CANVAS_SIZE / GRID_SIZE;
    let yLength = CANVAS_SIZE / GRID_SIZE;
    CONTEXT_FOREGROUND.fillRect(xStart, yStart, xLength, yLength);
  }
  CONTEXT_FOREGROUND.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fillSquare(fruit.x, fruit.y, FRUIT_COLOR);
  // Render snake from head to tail.
  for (let i = snake.body.length - 1; i >= 0; i--) {
    fillSquare(snake.body[i].x, snake.body[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
