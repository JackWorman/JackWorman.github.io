"use strict";

import * as FrameRate from "./FrameRate.js";
import * as Score from "./Score.js";
import Ship from "./Ship.js";
import Asteroid from "./Asteroid.js";
import {canvasSize, canvasScale, scaleCanvas} from "./ScaleCanvas.js";
import {checkCollison} from "./CollisionDetection.js";

const MILLISECONDS_PER_SECOND = 1000;

const FRAMES_PER_SECOND = 120;
const ASTEROID_SPAWN_INTERVAL = 5000;

let ship = new Ship(canvasSize/2, canvasSize/2);
let asteroids = [];
let timeOfLastAsteroidSpawn;
let scoreMultiplier = 1;
let gameLoopTimeout;

async function reset() {
  if (typeof gameLoopTimeout === `undefined`) {
    await Swal.fire(`WASD to move.\nMouse to aim.\nMouse buttons or space to shoot.`);
  } else {
    clearTimeout(gameLoopTimeout);
    await Swal.fire({text: `Game Over`, showConfirmButton: false, timer: 1000});
  }
  FrameRate.reset();
  ship = new Ship(canvasSize/2, canvasSize/2);
  asteroids = [];
  timeOfLastAsteroidSpawn = -ASTEROID_SPAWN_INTERVAL;
  scoreMultiplier = 1;
  Score.reset();
  // gameLoopInterval = setInterval(gameLoop, MILLISECONDS_PER_SECOND/FRAMES_PER_SECOND);
  scaleCanvas();
  gameLoopTimeout = setTimeout(gameLoop, 0);
}

function gameLoop() {
  if (typeof gameLoop.previousTime === `undefined`) {
    gameLoop.previousTime = 0;
  }
  const currentTime = performance.now();
  const deltaSeconds = (currentTime - gameLoop.previousTime)/MILLISECONDS_PER_SECOND;
  gameLoop.previousTime = currentTime;

  FrameRate.update();

  // Checks for laser expiration and laser-asteroid collisions.
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    if (ship.lasers[i].checkExpiration(currentTime)) {
      ship.lasers.splice(i, 1);
      scoreMultiplier = 1;
      continue;
    }
    for (const [index, asteroid] of asteroids.entries()) {
      if (checkCollison(ship.lasers[i].points, asteroid.points)) {
        if (asteroid.size > 0) {
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
        }
        asteroids.splice(index, 1); // Removes the element at 'index'.
        Score.update(asteroids.length * scoreMultiplier);
        scoreMultiplier++;
        ship.lasers.splice(i, 1);
        break;
      }
    }
  }

  // Checks for ship-asteroid collisions.
  for (const [index, asteroid] of asteroids.entries()) {
    if (checkCollison(ship.points, asteroid.points)) {
      if (ship.health === 0) {
        reset();
        return;
      }
      ship.health--;
      asteroids.splice(index, 1); // Removes the asteroid that was hit.
      break;
    }
  }

  // Move all the sprites.
  const allSprites = [ship, ...ship.lasers, ...asteroids];
  for (const sprite of allSprites) {
    sprite.move(deltaSeconds, canvasSize, canvasScale);
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

  gameLoopTimeout = setTimeout(gameLoop, 0);
}

export function render() {
  const CANVAS_FOREGROUND = document.getElementById(`canvas-foreground`);
  const CONTEXT_FOREGROUND = CANVAS_FOREGROUND.getContext(`2d`);
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
