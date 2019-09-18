'use strict';

import {Snake} from './Snake.js';
import {Fruit} from './Fruit.js';
import {KeyCode} from './KeyCode.js';

// Constants
let CANVAS_SIZE = 690; // in pixels
const GRID_SIZE = 30;
// if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
//   throw 'CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.';
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
let loop2;
let displayScore = 0;

// Run on load.
// TODO: make into ISIF
setUpForeground();
reset();

window.onresize = function() {
  if (document.body.clientWidth < document.body.clientHeight) {
    // alter using width
    if (document.body.clientWidth < 690) {
      let scaleFactor = document.body.clientWidth / 690;
      document.body.style.transform = 'scale('+scaleFactor+', '+scaleFactor+')';
      // CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = document.body.clientWidth;
      // DIV_HEADER_CONTAINER = document.body.clientWidth + 2;
      // CANVAS_SIZE = document.body.clientWidth;
    } else {
      CANVAS_SIZE = 690;
      DIV_HEADER_CONTAINER = 690 + 2;
      CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = 690;
    }
  } else {
    // alter using height
    if (document.body.clientHeight < 690) {
      CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = document.body.clientHeight;
      DIV_HEADER_CONTAINER = document.body.clientHeight + 2;
      CANVAS_SIZE = document.body.clientHeight;
    } else {
      CANVAS_SIZE = 690;
      DIV_HEADER_CONTAINER = 690 + 2;
      CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = 690;
    }
  }



  renderForeground();
};

document.addEventListener('keydown', function(event) {
  if (!controlsEnabled
    || (event.keyCode !== KeyCode.a && event.keyCode !== KeyCode.w && event.keyCode !== KeyCode.d
      && event.keyCode !== KeyCode.s && event.keyCode !== KeyCode.leftArrow && event.keyCode !== KeyCode.upArrow
      && event.keyCode !== KeyCode.rightArrow && event.keyCode !== KeyCode.downArrow)
    ) {
    return;
  }
  // Start Game.
  if (snake.direction === 'none' && directionQueue.length === 0) {
    loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
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

function setUpForeground() {
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = CANVAS_SIZE;
}

async function reset() {
  controlsEnabled = false;
  clearInterval(loop);
  clearInterval(loop2);
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
  SPAN_SCORE.textContent = '000000000';
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
  let paddingZeros = '000000000';
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
