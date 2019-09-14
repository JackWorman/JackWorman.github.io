'use strict';

import Snake from './modules/snake.js';
import Fruit from './modules/fruit.js';

var framesPerSecond = 15;
var showGrid = false;
var inputQueuing = true;
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
// DOM Elements
const CANVAS_BACKGROUND = document.getElementById('canvas-background');
const CONTEXT_BACKGROUND = CANVAS_BACKGROUND.getContext('2d');
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
const SPAN_SCORE = document.getElementById('span-score');
// Globals
var directionQueue = [];
var snake;
var fruit = new Fruit();
var score = 0;
var distanceTraveled;
var smallestDistancePossible;
var controlsEnabled = false;
var loop;

// Run on load.
setUpBackgroundAndForeground();
reset();

document.addEventListener('keydown', function(event) {
  if (!controlsEnabled || (event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40)) {
    return;
  }
  if (snake.direction === 'none' && directionQueue.length === 0) {
      loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / framesPerSecond);
  }
  if (inputQueuing) {
    var dir = directionQueue.length ? directionQueue[directionQueue.length - 1] : snake.direction;
    if (dir === 'left' || dir === 'right') {
      if (event.keyCode === 38) {
        directionQueue.push('up');
      } else if (event.keyCode === 40) {
        directionQueue.push('down');
      }
    } else if (dir === 'up' || dir === 'down') {
      if (event.keyCode === 37) {
        directionQueue.push('left');
      } else if (event.keyCode === 39) {
        directionQueue.push('right');
      }
    } else if (dir === 'none') {
      directionQueue.push(DIRECTIONS[event.keyCode - 37]);
    }
  } else {
    if (snake.body[0].direction === 'left' || snake.body[0].direction === 'right') {
      if (event.keyCode === 38) {
        directionQueue.push('up');
      } else if (event.keyCode === 40) {
        directionQueue.push('down');
      }
    } else if (snake.body[0].direction === 'up' || snake.body[0].direction === 'down') {
      if (event.keyCode === 37) {
        directionQueue.push('left');
      } else if (event.keyCode === 39) {
        directionQueue.push('right');
      }
    } else if (snake.body[0].direction === 'none') {
      directionQueue.push(DIRECTIONS[event.keyCode - 37]);
    }
  }
}, true);

function setUpBackgroundAndForeground() {
  CANVAS_BACKGROUND.width = CANVAS_BACKGROUND.height = CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = CANVAS_SIZE;
  renderBackground();
}

function renderBackground() {
  CONTEXT_BACKGROUND.fillStyle = BLACK;
  CONTEXT_BACKGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  if (showGrid) {
    CONTEXT_BACKGROUND.strokeStyle = WHITE;
    CONTEXT_BACKGROUND.beginPath();
    for (var i = 0; i <= GRID_SIZE; i++) {
      var step = i * CANVAS_SIZE / GRID_SIZE + 0.5;
      CONTEXT_BACKGROUND.moveTo(0.5, step);
      CONTEXT_BACKGROUND.lineTo(CANVAS_SIZE, step);
      CONTEXT_BACKGROUND.moveTo(step, 0.5);
      CONTEXT_BACKGROUND.lineTo(step, CANVAS_SIZE);
    }
    CONTEXT_BACKGROUND.stroke();
  }
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
  updateScore();
  score = 0;
  SPAN_SCORE.textContent = 'Score: ' + score;
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
  if (typeof localStorage.highscore === 'undefined') {
    localStorage.highscore = 0;
  }
  if (localStorage.highscore < score) {
    localStorage.highscore = score;
  }
  document.getElementById('span-highscore').textContent = 'Highscore: ' + localStorage.highscore;
}

function gameLoop() {
  distanceTraveled++;
  var direction = directionQueue.shift();
  if (direction) {
    snake.direction = direction;
  }
  snake.move();
  if (snake.checkCollison(GRID_SIZE)) {
    reset();
  }
  if (snake.checkFruitEaten(fruit)) {
    // Update score.
    score += Math.ceil(snake.body.length * smallestDistancePossible / distanceTraveled * framesPerSecond);
    SPAN_SCORE.textContent = 'Score: ' + score;
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
    var xStart = x * CANVAS_SIZE / GRID_SIZE + 0.5;
    var yStart = y * CANVAS_SIZE / GRID_SIZE + 0.5;
    var xLength = CANVAS_SIZE / GRID_SIZE;
    var yLength = CANVAS_SIZE / GRID_SIZE;
    CONTEXT_FOREGROUND.fillRect(xStart, yStart, xLength, yLength);
  }
  CONTEXT_FOREGROUND.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fillSquare(fruit.x, fruit.y, WHITE);
  // Render snake from head to tail.
  for (var i = snake.body.length - 1; i >= 0; i--) {
    fillSquare(snake.body[i].x, snake.body[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
