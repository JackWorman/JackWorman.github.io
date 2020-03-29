"use strict";

import Ship from "./ship.js";
import Asteroid from "./asteroid.js";
import * as FrameRate from "./FrameRate.js";
import * as Score from "./Score.js";
import {canvasSize, scaleCanvas} from "./ScaleCanvas.js";

const MILLISECONDS_PER_SECOND = 1000;

const BLACK = `rgb(0, 0, 0)`;
const FRAMES_PER_SECOND = 60;
const ASTEROID_SPAWN_INTERVAL = 5000;

export const CANVAS_FOREGROUND = document.getElementById(`canvas-foreground`);
const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext(`2d`);
const SPAN_SCORE = document.getElementById(`span-score`);
const SPAN_HIGHSCORE = document.getElementById(`span-highscore`);

let ship = new Ship(canvasSize/2, canvasSize/2);
let asteroids = [];
let timeOfLastAsteroidSpawn;
let gameLoopInterval;
let scoreMultiplier = 1;



async function reset() {
  if (typeof gameLoopInterval === `undefined`) {
    await Swal.fire(`WASD to move.\nMouse to aim.\nMouse buttons or space to shoot.`);
  } else {
    clearInterval(gameLoopInterval);
    await Swal.fire({text: `Game Over`, showConfirmButton: false, timer: 1000});
  }
  FrameRate.reset();
  ship = new Ship(canvasSize/2, canvasSize/2);
  asteroids = [];
  timeOfLastAsteroidSpawn = -ASTEROID_SPAWN_INTERVAL;
  scoreMultiplier = 1;
  Score.reset();
  gameLoopInterval = setInterval(gameLoop, MILLISECONDS_PER_SECOND/FRAMES_PER_SECOND);
}

function gameLoop() {
  if (typeof gameLoop.previousTime === `undefined`) {
    gameLoop.previousTime = 0;
  }
  const currentTime = performance.now();
  const deltaTime = currentTime - gameLoop.previousTime;
  gameLoop.previousTime = currentTime;

  FrameRate.update();

  for (const asteroid of asteroids) {
    asteroid.move(canvasSize, deltaTime);
  }

  ship.move(canvasSize, deltaTime);
  if (ship.detectCollison(asteroids)) {
    reset();
  }

  // Laser logic, interates in reverse so that lasers can be removed.
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    if (ship.lasers[i].checkExpiration(currentTime)) {
      ship.lasers.splice(i, 1);
      continue;
    }
    ship.lasers[i].move(canvasSize, deltaTime);
    if (ship.lasers[i].detectCollison(asteroids)) { // Laser hit an asteroid
      Score.update(asteroids.length * scoreMultiplier);
      scoreMultiplier++;
      ship.lasers.splice(i, 1);
    }
  }

  // Spawn an asteroid every "ASTEROID_SPAWN_INTERVAL".
  if (currentTime - timeOfLastAsteroidSpawn >= ASTEROID_SPAWN_INTERVAL) {
    if (Math.random() < 0.5) {
      asteroids.push(new Asteroid(-100, (canvasSize + 200)*Math.random(), 2));
    } else {
      asteroids.push(new Asteroid((canvasSize + 200)*Math.random(), -100, 2));
    }
    timeOfLastAsteroidSpawn = currentTime;
  }

  ship.shoot(currentTime);

  window.requestAnimationFrame(render);
}

export function render() {
  CONTEXT_FOREGROUND.clearRect(0, 0, canvasSize, canvasSize);
  const allSprites = [...ship.lasers, ...asteroids, ship];
  for (const sprite of allSprites) {
    sprite.render(CONTEXT_FOREGROUND);
  }
  CONTEXT_FOREGROUND.strokeStyle = `rgb(255, 255, 255)`;
  CONTEXT_FOREGROUND.strokeText(`x${scoreMultiplier}`, 50, 50);
}

scaleCanvas();
reset();
