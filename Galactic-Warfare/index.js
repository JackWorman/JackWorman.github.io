'use strict';

import Ship from './ship.js';
import Bullet from './bullet.js';

const FRAMES_PER_SECOND = 60;
const MILLISECONDS_PER_SECOND = 1000;
const CANVAS_SIZE = 800;
const CANVAS_FOREGROUND = document.getElementById('canvas-foreground');
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext('2d');

CANVAS_FOREGROUND.width = CANVAS_SIZE;
CANVAS_FOREGROUND.height = CANVAS_SIZE;

var ship = new Ship(CANVAS_SIZE / 4, CANVAS_SIZE / 2);

var inputs = {}; // You could also use an array
onkeydown = onkeyup = function(e) {
  e = e || event; // to deal with IE
  inputs[e.keyCode] = e.type == 'keydown';
}

function getMousePos(canvas, evt) {
  var rect = CANVAS_FOREGROUND.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
CANVAS_FOREGROUND.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(CANVAS_FOREGROUND, evt);
}, false);
onmousedown = onmouseup = function(e) {
  if (e.buttons === 1) {
    inputs['leftMouseDown'] = true;
  } else {
    inputs['leftMouseDown'] = false;
  }
}
CANVAS_FOREGROUND.addEventListener('contextmenu', event => event.preventDefault());

var mousePos = {x: 0, y: 0};

function gameLoop() {
  ship.shoot(inputs, mousePos);
  ship.move(inputs, CANVAS_SIZE);
  for (var i = 0; i < ship.bullets.length; i++) {
    if (ship.bullets[i].move(CANVAS_SIZE)) {
      ship.bullets.splice(i, 1);
      i--;
    }
  }
  render();
}

function render() {
  CONTEXT_FOREGROUND.fillStyle = 'rgb(255, 255, 255)';
  CONTEXT_FOREGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (var i = 0; i < ship.bullets.length; i++) {
    ship.bullets[i].render(CONTEXT_FOREGROUND);
  }
  ship.render(CONTEXT_FOREGROUND, mousePos);
}

var loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
