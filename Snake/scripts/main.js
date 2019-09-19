'use strict';

import {Snake} from './Snake.js';
import {Fruit} from './Fruit.js';
import {KeyCode} from './KeyCode.js';

// Constants
let canvasSize = 690; // in pixels
const GRID_SIZE = 30;
// if (canvasSize / GRID_SIZE !== Math.round(canvasSize / GRID_SIZE)) {
//   throw 'canvasSize / GRID_SIZE is not a whole number. The canvas might render incorrectly.';
// }
const FRAMES_PER_SECOND = 15;
const MILLISECONDS_PER_SECOND = 1000;
const FRUIT_COLOR = 'rgb(255, 255, 255)';
const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(148, 0, 211)",
];
// DOM Elements
const SPAN_FPS = document.getElementById('span-fps');
const DIV_HEADER_CONTAINER = document.getElementById('div-header-container');
const SPAN_TITLE = document.getElementById('span-title');
const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
// Globals
let directionQueue = [];
let snake = new Snake(GRID_SIZE / 2, GRID_SIZE / 2);
let fruit = new Fruit();
let score = 0;
let distanceTraveled;
let smallestDistancePossible;
let controlsEnabled = false;
let loop;
let loop2;
let displayScore = 0;

// Run on load.
// TODO: make into ISIF
scaleCanvas();
reset();

window.onresize = scaleCanvas;

/**
 * Must be done in javascript because it doesn't work in CSS calc().
 * @return {[type]} [description]
 */
function scaleCanvas() {
  canvasSize = 690 * Math.min(document.body.clientWidth, document.body.clientHeight) / 900;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  renderForeground();
}

document.addEventListener('keydown', function(event) {
  if (!controlsEnabled) {
    return;
  }
  // Start Game.
  if (snake.direction === 'none' && directionQueue.length === 0) {
    loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
    document.body.style.cursor = 'none';
  }
  let currentDirection = directionQueue.length ? directionQueue[directionQueue.length - 1] : snake.direction;
  if (currentDirection === 'left' || currentDirection === 'right') {
    if (event.keyCode === KeyCode.upArrow || event.keyCode === KeyCode.w) {
      directionQueue.push('up');
    } else if (event.keyCode === KeyCode.downArrow || event.keyCode === KeyCode.s) {
      directionQueue.push('down');
    }
  } else if (currentDirection === 'up' || currentDirection === 'down') {
    if (event.keyCode === KeyCode.leftArrow || event.keyCode === KeyCode.a) {
      directionQueue.push('left');
    } else if (event.keyCode === KeyCode.rightArrow || event.keyCode === KeyCode.d) {
      directionQueue.push('right');
    }
  } else if (currentDirection === 'none') {
    if (event.keyCode === KeyCode.leftArrow || event.keyCode === KeyCode.a) {
      directionQueue.push('left');
    } else if (event.keyCode === KeyCode.upArrow || event.keyCode === KeyCode.w) {
      directionQueue.push('up');
    } else if (event.keyCode === KeyCode.rightArrow || event.keyCode === KeyCode.d) {
      directionQueue.push('right');
    } else if (event.keyCode === KeyCode.downArrow || event.keyCode === KeyCode.s) {
      directionQueue.push('down');
    }
  }
}, true);

async function reset() {
  controlsEnabled = false;
  clearInterval(loop);
  clearInterval(loop2);
  document.body.style.cursor = 'auto';
  if (typeof loop === 'undefined') {
    await Swal.fire('Use the arrow keys or WASD to move.');
    await Swal.fire(
      'Collect the fruit to gain points.\n'
      + 'More points are rewarded for being efficent.'
    );
  } else { // Does not run the first time.
    await Swal.fire({text: 'Game Over!', showConfirmButton: false, timer: 1500});
  }
  directionQueue = [];
  SPAN_FPS.textContent = 'FPS: 0.00';
  // Reset score variables.
  updateHighscore();
  score = 0;
  displayScore = 0;
  SPAN_SCORE.textContent = '0'.repeat(8);
  // Setup and render foreground.
  snake = new Snake(GRID_SIZE / 2, GRID_SIZE / 2);
  fruit.placeFruit(GRID_SIZE, snake);
  // Reset distance variables.
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(fruit.x - snake.body[0].x) + Math.abs(fruit.y - snake.body[0].y);
  renderForeground();
  controlsEnabled = true;
}

let deltaDisplayScore = 1;

function updateScore() {
  clearInterval(loop2);
  deltaDisplayScore = Math.ceil((score - displayScore) / 200);
  loop2 = setInterval(scoreAnimation, MILLISECONDS_PER_SECOND / 100);
}

function scoreAnimation() {
  displayScore += deltaDisplayScore;
  if (displayScore > score) {
    displayScore = score;
  }
  let paddingZeros = '0'.repeat(8);
  let digits = 0;
  while (displayScore / Math.pow(10, digits) >= 1) {
    digits++;
  }
  paddingZeros = paddingZeros.slice(0, paddingZeros.length - digits);
  SPAN_SCORE.textContent = paddingZeros + displayScore;
  if (displayScore > localStorage.highscore) {
    SPAN_HIGHSCORE.textContent = paddingZeros + displayScore;
  }
  if (displayScore >= score) {
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
  if (Number(localStorage.highscore) === 0) {
    SPAN_HIGHSCORE.textContent = '0'.repeat(8);
  } else {
    // Calculates the amount of padding-zeros needed.
    let paddingZeros = '0'.repeat(8);
    let count = 0;
    while (localStorage.highscore / Math.pow(10, count) >= 1) {
      count++
    }
    paddingZeros = paddingZeros.slice(0, paddingZeros.length - count);
    SPAN_HIGHSCORE.textContent = paddingZeros + localStorage.highscore;
  }
}

function calculateFPS() {
  if (typeof calculateFPS.deltas === 'undefined') { // First time setup.
    calculateFPS.deltas = [];
    calculateFPS.then = performance.now();
    return;
  }
  let now = performance.now();
  calculateFPS.deltas.push(now - calculateFPS.then);
  if (calculateFPS.deltas.length > 15) {
    calculateFPS.deltas.shift();
  }
  let averageDelta = (calculateFPS.deltas.reduce((a, b) => (a + b)) / calculateFPS.deltas.length);
  SPAN_FPS.textContent = 'FPS: ' + (MILLISECONDS_PER_SECOND / averageDelta).toFixed(2);
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
    let xStart = x * canvasSize / GRID_SIZE + 0.5;
    let yStart = y * canvasSize / GRID_SIZE + 0.5;
    let xLength = canvasSize / GRID_SIZE;
    let yLength = canvasSize / GRID_SIZE;
    CONTEXT_FOREGROUND.fillRect(xStart, yStart, xLength, yLength);
  }
  CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
  fillSquare(fruit.x, fruit.y, FRUIT_COLOR);
  // Render snake from head to tail.
  for (let i = snake.body.length - 1; i >= 0; i--) {
    fillSquare(snake.body[i].x, snake.body[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
