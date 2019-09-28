'use strict';

import {Snake} from './Snake.js';
import {Pellet} from './Pellet.js';
import {KeyCode} from './KeyCode.js';
import {updateScore, incrementScore, updateHighscore, displayScore} from './score.js';
// import * as Score from './score.js'

// Constants
const GRID_SIZE = 30;
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
const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');

const SPAN_FPS = document.getElementById('span-fps');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
// Globals
let canvasSize = 690; // in pixels
let directionQueue = [];
const snake = new Snake(GRID_SIZE / 2, GRID_SIZE / 2);
const pellet = new Pellet();
let score = 0;
let distanceTraveled;
let smallestDistancePossible;
let controlsEnabled = false;
let gameLoopInterval;

let displayedScore = 0;

/**
 * This must be done in Javascript because it clears the canvas constantly when using calc() in CSS.
 */
function scaleCanvas() {
  canvasSize = 690 * Math.min(document.body.clientWidth, document.body.clientHeight) / 900;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  render();
};

window.onload = () => {
  scaleCanvas();
  reset();
}

window.onresize = scaleCanvas;

document.addEventListener('keydown', (event) => {
  if (!controlsEnabled
    || (event.keyCode !== KeyCode.a && event.keyCode !== KeyCode.w && event.keyCode !== KeyCode.d
      && event.keyCode !== KeyCode.s && event.keyCode !== KeyCode.leftArrow && event.keyCode !== KeyCode.upArrow
      && event.keyCode !== KeyCode.rightArrow && event.keyCode !== KeyCode.downArrow)
    ) {
    return;
  }
  // Start Game.
  if (snake.direction === 'none' && directionQueue.length === 0) {
    gameLoopInterval = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
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
  document.body.style.cursor = 'auto';
  // Runs the first time.
  if (typeof gameLoopInterval === 'undefined') {
    await Swal.fire('Use the arrow keys\nor\nWASD to move.');
    await Swal.fire('Collect the pellet to gain points.\nMore points are rewarded for being efficent.');
  // Does not run the first time.
  } else {
    await Swal.fire({text: 'Game Over!', showConfirmButton: false, timer: 1500});
  }
  directionQueue = [];
  SPAN_FPS.textContent = 'FPS: 0.00';
  // Resets score variables and displays.
  updateHighscore(score);
  score = 0;
  displayedScore = 0;
  displayScore(SPAN_SCORE, displayedScore)
  // Snake and pellet.
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake);
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(pellet.x - snake.bodySegment[0].x) + Math.abs(pellet.y - snake.bodySegment[0].y);
  render();
  controlsEnabled = true;
}

function calculateFPS() {
  if (typeof calculateFPS.deltas === 'undefined') { // First time setup.
    calculateFPS.deltas = [];
    calculateFPS.then = performance.now();
    return;
  }
  let now = performance.now();
  calculateFPS.deltas.push(now - calculateFPS.then);
  if (calculateFPS.deltas.length > FRAMES_PER_SECOND) {
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
    clearInterval(gameLoopInterval);
    // clearInterval(incrementScoreInterval);
    reset();
    return;
  }
  if (snake.checkFruitEaten(pellet)) {
    score += Math.floor(Math.pow(snake.bodySegment.length, 1 + smallestDistancePossible / distanceTraveled));
    updateScore();
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake);
    distanceTraveled = 0;
    smallestDistancePossible = Math.abs(pellet.x - snake.bodySegment[0].x) + Math.abs(pellet.y - snake.bodySegment[0].y);
  }
  render();
}

function render() {
  CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
  function fillSquare(x, y, color) {
    CONTEXT_FOREGROUND.fillStyle = color;
    const squareLength = canvasSize / GRID_SIZE;
    CONTEXT_FOREGROUND.fillRect(x * squareLength + 0.5, y * squareLength + 0.5, squareLength, squareLength);
  }
  fillSquare(pellet.x, pellet.y, FRUIT_COLOR);
  // Renders snake from head to tail.
  for (let i = snake.bodySegment.length - 1; i >= 0; i--) {
    fillSquare(snake.bodySegment[i].x, snake.bodySegment[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
