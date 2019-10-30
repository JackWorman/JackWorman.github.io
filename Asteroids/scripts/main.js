'use strict';

import Ship from './ship.js';
import Asteroid from './asteroid.js';
import * as FrameRate from './FrameRate.js';

const BLACK = `rgb(0, 0, 0)`;
const FRAMES_PER_SECOND = 60;
const MILLISECONDS_PER_SECOND = 1000;
let canvasSize = 800;
const CANVAS_FOREGROUND = document.getElementById(`canvas-foreground`);
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext(`2d`);
const SPAN_SCORE = document.getElementById(`span-score`);
const SPAN_HIGHSCORE = document.getElementById(`span-highscore`);
const ASTEROID_SPAWN_INTERVAL = 5000;

CANVAS_FOREGROUND.width = canvasSize;
CANVAS_FOREGROUND.height = canvasSize;

let ship;
let asteroids;
let timeOfLastAsteroidSpawn;
let loop;
let score;
let scoreMultiplier;

/**
 * Must be done in javascript because it doesn`t work in CSS calc().
 */
function scaleCanvas() {
  canvasSize = 690 * Math.min(document.body.clientWidth, document.body.clientHeight) / 900;
  CANVAS_FOREGROUND.width = CANVAS_FOREGROUND.height = canvasSize;
  render(); // TODO: ship not made yet onload
};

window.onload = window.onresize = () => {
  scaleCanvas();
}

// Get inputs.
let inputs = {`mousePos`: {x: 0, y: 0}};
onkeydown = onkeyup = (e) => {
  inputs[e.keyCode] = e.type === `keydown`;
}
onmousedown = onmouseup = (e) => {
  if (e.button === 0) {
    inputs[`leftMouseDown`] = e.type === `mousedown`;
  } else if (e.button === 2) {
    inputs[`rightMouseDown`] = e.type === `mousedown`;
  }
}
onmousemove = (e) => {
  let rect = CANVAS_FOREGROUND.getBoundingClientRect();
  inputs["mousePos"] = {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

async function reset() {
  if (typeof loop !== `undefined`) {
    clearInterval(loop);
    await Swal.fire({text: `Game Over`, showConfirmButton: false, timer: 1000});
  } else {
    await Swal.fire(`WASD to move.\nMouse to aim.\nMouse buttons or space to shoot.`);
  }
  FrameRate.reset();
  ship = new Ship(canvasSize / 2, canvasSize / 2);
  asteroids = [];
  timeOfLastAsteroidSpawn = -ASTEROID_SPAWN_INTERVAL;
  score = 0;
  scoreMultiplier = 1;
  updateScore();
  loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
}

function updateScore() {
  let count = 1;
  while (score / Math.pow(10, count) >= 1) {
    count++;
  }
  SPAN_SCORE.textContent = ``;
  for (let i = 0; i < 9 - count; i++) {
    SPAN_SCORE.textContent = SPAN_SCORE.textContent + `0`;
  }
  SPAN_SCORE.textContent = SPAN_SCORE.textContent + score
  // Update highscore SPAN_HIGHSCORE
  if (typeof localStorage.asteroidHighscore === `undefined`) {
    localStorage.asteroidHighscore = 0;
  }
  if (localStorage.asteroidHighscore < score) {
    localStorage.asteroidHighscore = score;
  }
  count = 1;
  while (localStorage.asteroidHighscore / Math.pow(10, count) >= 1) {
    count++;
  }
  SPAN_HIGHSCORE.textContent = ``;
  for (let i = 0; i < 9 - count; i++) {
    SPAN_HIGHSCORE.textContent = SPAN_HIGHSCORE.textContent + `0`;
  }
  SPAN_HIGHSCORE.textContent = SPAN_HIGHSCORE.textContent + localStorage.asteroidHighscore;
}

function gameLoop() {
  if (typeof gameLoop.then === `undefined`) {
    gameLoop.then = 0;
  }
  let now = performance.now();
  let deltaTime = now - gameLoop.then;
  gameLoop.then = now;
  FrameRate.update();
  // calculateFPS();
  if (performance.now() - timeOfLastAsteroidSpawn > ASTEROID_SPAWN_INTERVAL) {
    if (Math.random() < 0.5) {
      asteroids.push(new Asteroid(-100, Math.random() * (canvasSize + 200), 2));
    } else {
      asteroids.push(new Asteroid(Math.random() * (canvasSize + 200), -100, 2));
    }
    timeOfLastAsteroidSpawn = performance.now();
  }
  ship.shoot(inputs);
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].move(canvasSize, deltaTime);
  }
  ship.move(inputs, canvasSize, deltaTime);
  if (ship.detectCollison(asteroids)) {
    reset();
  }
  for (let i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].move(canvasSize, deltaTime)) { // Laser faded
      scoreMultiplier = 1;
      ship.lasers.splice(i, 1);
      i--;
    } else if (ship.lasers[i].detectCollison(asteroids)) { // Laser hit an asteroid
      score += asteroids.length * scoreMultiplier;
      updateScore();
      scoreMultiplier++;
      ship.lasers.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(render);
}

function render() {
  CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
  for (let i = 0; i < ship.lasers.length; i++) {
    ship.lasers[i].render(CONTEXT_FOREGROUND);
  }
  ship.render(CONTEXT_FOREGROUND, inputs["mousePos"]);
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].render(CONTEXT_FOREGROUND);
  }
  // CONTEXT_FOREGROUND.font = "20px Georgia";
  CONTEXT_FOREGROUND.strokeStyle = `rgb(255, 255, 255)`;
  CONTEXT_FOREGROUND.strokeText(`x` + scoreMultiplier, 50, 50);
}

reset();
