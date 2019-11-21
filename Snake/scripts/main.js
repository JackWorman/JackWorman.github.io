'use strict';

import {Snake} from './Snake.js';
import {Pellet} from './Pellet.js';
import * as KeyCode from './KeyCode.js';
import * as Score from './Score.js';
import * as FrameRate from './FrameRate.js';
import {canvasSize} from './ScaleCanvas.js';

const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
const GRID_SIZE = 30;
const FRAMES_PER_SECOND = 15;
const MILLISECONDS_PER_SECOND = 1000; // TODO: move to a conversions file

const snake = new Snake();
const pellet = new Pellet();
let directionQueue = [];
let distanceTraveled;
let smallestDistancePossible;
let controlsEnabled = false;
let gameLoopInterval;

window.addEventListener('load', reset);

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
  const currentDirection = directionQueue.length === 0 ? snake.direction : directionQueue[directionQueue.length - 1];
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
});

function gameLoop() {
  FrameRate.update();
  const direction = directionQueue.shift();
  if (typeof direction !== 'undefined') {
    snake.direction = direction;
  }
  snake.move();
  distanceTraveled++;
  if (snake.checkCollison(GRID_SIZE)) {
    clearInterval(gameLoopInterval);
    reset();
    return;
  }
  if (snake.checkPelletEaten(pellet)) {
    Score.update(Math.floor(Math.pow(snake.bodySegments.length, 1 + smallestDistancePossible / distanceTraveled)));
    snake.grow();
    pellet.placePellet(GRID_SIZE, snake.bodySegments);
    distanceTraveled = 0;
    smallestDistancePossible = Math.abs(pellet.x - snake.bodySegments[0].x) + Math.abs(pellet.y - snake.bodySegments[0].y);
  }
  window.requestAnimationFrame(render);
}

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
  FrameRate.reset();
  Score.reset();
  // Snake and pellet.
  snake.reset(GRID_SIZE / 2, GRID_SIZE / 2);
  pellet.placePellet(GRID_SIZE, snake.bodySegments);
  distanceTraveled = 0;
  smallestDistancePossible = Math.abs(pellet.x - snake.bodySegments[0].x) + Math.abs(pellet.y - snake.bodySegments[0].y);
  window.requestAnimationFrame(render);
  controlsEnabled = true;
}

export function render() {
  CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
  const fillSquare = (x, y, color) => {
    CONTEXT_FOREGROUND.fillStyle = color;
    const squareLength = canvasSize / GRID_SIZE;
    CONTEXT_FOREGROUND.fillRect(x * squareLength + 0.5, y * squareLength + 0.5, squareLength, squareLength);
  }
  pellet.render(fillSquare);
  snake.render(fillSquare);
}
