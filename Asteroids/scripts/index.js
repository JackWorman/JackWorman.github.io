'use strict';

import Ship from './ship.js';
import Asteroid from './asteroid.js';

const FRAMES_PER_SECOND = 60;
const MILLISECONDS_PER_SECOND = 1000;
const CANVAS_SIZE = 800;
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');
const H_FPS = document.getElementById('h1-fps');

CANVAS_FOREGROUND.width = CANVAS_SIZE;
CANVAS_FOREGROUND.height = CANVAS_SIZE;

var ship = new Ship(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
var asteroids = [
  new Asteroid(Math.random() * CANVAS_SIZE, Math.random() * CANVAS_SIZE, 100, 2),
  new Asteroid(Math.random() * CANVAS_SIZE, Math.random() * CANVAS_SIZE, 50, 4),
  new Asteroid(Math.random() * CANVAS_SIZE, Math.random() * CANVAS_SIZE, 25, 8)
];

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

// var then = Date.now();
// var deltas = [];
function update() {
  // var now = Date.now();
  // deltas.push(now - then);
  // H_FPS.textContent = 'FPS: ' + Math.round(deltas.reduce((a, b) => (a + b)) / deltas.length);
  // then = now;
  ship.shoot(inputs);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].move(CANVAS_SIZE);
  }
  ship.move(inputs, CANVAS_SIZE);
  for (var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].move(CANVAS_SIZE)) {
      ship.lasers.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].detectCollison(asteroids)) {
      ship.lasers.splice(i, 1);
      i--;
    }
  }
}

function render() {
  CONTEXT_FOREGROUND.fillStyle = 'rgb(255, 255, 255)';
  CONTEXT_FOREGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
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
requestAnimationFrame();

var loop = setInterval(update, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
