'use strict';

import Ship from './ship.js';
import Asteroid from './asteroid.js';

const BLACK = 'rgb(0, 0, 0)';
const FRAMES_PER_SECOND = 60;
const MILLISECONDS_PER_SECOND = 1000;
const CANVAS_SIZE = 800;
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
const SPAN_FPS = document.getElementById('span-fps');
const SPAN_SCORE = document.getElementById('span-score');

CANVAS_FOREGROUND.width = CANVAS_SIZE;
CANVAS_FOREGROUND.height = CANVAS_SIZE;

var ship;
var asteroids;
var lastSpawn;
var loop;
var score;

// Get inputs.
var inputs = {"mousePos": {x: 0, y: 0}};
onkeydown = onkeyup = function(e) {
  e = e || event; // to deal with IE
  inputs[e.keyCode] = e.type == 'keydown';
}
onmousedown = onmouseup = function(e) {
  if (e.buttons === 1) {
    inputs['leftMouseDown'] = true;
  } else {
    inputs['leftMouseDown'] = false;
  }
}
onmousemove = function(e) {
  var rect = CANVAS_FOREGROUND.getBoundingClientRect();
  inputs["mousePos"] = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

async function reset() {
  if (typeof loop !== 'undefined') {
    clearInterval(loop);
    await Swal.fire({text: 'Game Over', showConfirmButton: false, timer: 1000});
  }
  ship = new Ship(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
  asteroids = [];
  lastSpawn = 0;
  score = 0;
  updateScore()
  loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
}

function updateScore() {
  var count = 1;
  while (score / Math.pow(10, count) >= 1) {
    count++;
  }
  SPAN_SCORE.textContent = 'Score: ';
  for (var i = 0; i < 7 - count; i++) {
    SPAN_SCORE.textContent = SPAN_SCORE.textContent + '0';
  }
  SPAN_SCORE.textContent = SPAN_SCORE.textContent + score
}

var then = Date.now();
var deltas = [];
function gameLoop() {
  var now = Date.now();
  deltas.push(now - then);
  SPAN_FPS.textContent = 'FPS: ' + Math.round(deltas.reduce((a, b) => (a + b)) / deltas.length);
  then = now;

  if (Date.now() - lastSpawn > 5000) {
    if (Math.random() < 0.5) {
      asteroids.push(new Asteroid(-100, Math.random() * (CANVAS_SIZE + 200), 2));
    } else {
      asteroids.push(new Asteroid(Math.random() * (CANVAS_SIZE + 200), -100, 2));
    }
    lastSpawn = Date.now();
  }
  ship.shoot(inputs);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].move(CANVAS_SIZE);
  }
  ship.move(inputs, CANVAS_SIZE);
  if (ship.detectCollison(asteroids)) {
    reset();
  }
  for (var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].move(CANVAS_SIZE)) {
      ship.lasers.splice(i, 1);
      i--;
    } else if (ship.lasers[i].detectCollison(asteroids)) {
      score++;
      updateScore();
      ship.lasers.splice(i, 1);
      i--;
    }
  }
}

function render() {
  CONTEXT_FOREGROUND.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (var i = 0; i < ship.lasers.length; i++) {
    ship.lasers[i].render(CONTEXT_FOREGROUND);
  }
  ship.render(CONTEXT_FOREGROUND, inputs["mousePos"]);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].render(CONTEXT_FOREGROUND);
  }
}

var requestAnimationFrame = function() {
  render();
  window.requestAnimationFrame(requestAnimationFrame);
};

reset();
requestAnimationFrame();
