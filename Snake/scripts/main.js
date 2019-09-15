'use strict';

import {Snake} from './snake.js';
import {Fruit} from './fruit.js';

let framesPerSecond = 15;
let showGrid = false;
// Constants
const CANVAS_SIZE = 690; // in pixels
const GRID_SIZE = 30;
if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
  throw 'CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.';
}
const MILLISECONDS_PER_SECOND = 1000;
const GROW_RATE = 5;
const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';
const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
];
const DIRECTIONS = ['left', 'up', 'right', 'down'];
const LEFT_ARROW_KEY_CODE = 37;
const UP_ARROW_KEY_CODE = 38;
const RIGHT_ARROW_KEY_CODE = 39;
const DOWN_ARROW_KEY_CODE = 40;
const A_KEY_CODE = 65;
const W_KEY_CODE = 87;
const D_KEY_CODE = 68;
const S_KEY_CODE = 83;
// DOM Elements
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
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
    loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / framesPerSecond);
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
  updateScore();
  // SPAN_SCORE.textContent = 'Score: ' + score;
  // Setup and render foreground.
  snake = new Snake(GRID_SIZE / 2, GRID_SIZE / 2);
  fruit.placeFruit(GRID_SIZE, snake);
  // Reset distance variables.
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(fruit.x - snake.body[0].x) + Math.abs(fruit.y - snake.body[0].y);
  renderForeground();
  controlsEnabled = true;
}

function updateScore() {
  let padding = '';
  let count = 0;
  while (score / Math.pow(10, count) >= 1) {
    count++;
  }
  for (let i = 1; i < 7 - count; i++) {
    padding += '0';
  }
  SPAN_SCORE.textContent = '' + padding + score;
}

function updateHighscore() {
  // Sets up 'highscore' for the first time.
  if (typeof localStorage.highscore === 'undefined') {
    localStorage.highscore = 0;
  }
  if (localStorage.highscore < score) {
    localStorage.highscore = score;
  }
  // Calculates the amount of padding zeros needed.
  let padding = '000000';
  let count = 6;
  while (localStorage.highscore / Math.pow(10, count--) < 1) {
    padding = padding.slice(0, padding.length - 2);
  }
  // Updates the highscore display.
  SPAN_HIGHSCORE.textContent = '' + padding + localStorage.highscore;
}

function gameLoop() {
  distanceTraveled++;
  let direction = directionQueue.shift();
  if (direction) {
    snake.direction = direction;
  }
  snake.move();
  if (snake.checkCollison(GRID_SIZE)) {
    reset();
  }
  if (snake.checkFruitEaten(fruit)) {
    // Update score.
    score += Math.ceil(snake.body.length * smallestDistancePossible / distanceTraveled);
    updateScore();
    // Increase the size of the snake.
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
  fillSquare(fruit.x, fruit.y, WHITE);
  // Render snake from head to tail.
  for (let i = snake.body.length - 1; i >= 0; i--) {
    fillSquare(snake.body[i].x, snake.body[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
