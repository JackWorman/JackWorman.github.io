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

var ship = new Ship(CANVAS_SIZE / 2, CANVAS_SIZE / 2);

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
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

CANVAS_FOREGROUND.addEventListener('mousedown', function(evt) {
  var angle = Math.atan2(mousePos.y - ship.y, mousePos.x - ship.x);
  if (angle < 0) {
    angle = angle + 2 * Math.PI;
  }
  bullets.push(new Bullet(ship.x, ship.y, 10, angle));
}, false);

var mousePos = {x: 0, y: 0};
var bullets = [];

function gameLoop() {
  getInputs();
  ship.move();
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].move(CANVAS_SIZE)) {
      bullets.splice(i, 1);
      i--;
    }
  }
  render();
}

function getInputs() {
  if (map[65] && map[68]) {
    ship.dx = 0;
  } else if (map[65]) {
    ship.dx = -1;
  } else if (map[68]) {
    ship.dx = 1;
  } else {
    ship.dx = 0;
  }
  if (map[87] && map[83]) {
    ship.dy = 0;
  } else if (map[87]) {
    ship.dy = -1;
  } else if (map[83]) {
    ship.dy = 1;
  } else {
    ship.dy = 0;
  }
}

function render() {
  CONTEXT_FOREGROUND.fillStyle = 'rgb(255, 255, 255)';
  CONTEXT_FOREGROUND.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].render(CONTEXT_FOREGROUND);
  }
  ship.render(CONTEXT_FOREGROUND, mousePos);
}

var loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
