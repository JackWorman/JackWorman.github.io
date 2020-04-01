"use strict";

import Ship from "./ship.js";
import Asteroid from "./asteroid.js";
import * as FrameRate from "./FrameRate.js";
import * as Score from "./Score.js";
import {canvasSize, scaleCanvas} from "./ScaleCanvas.js";

const MILLISECONDS_PER_SECOND = 1000;

const FRAMES_PER_SECOND = 120;
const ASTEROID_SPAWN_INTERVAL = 5000;

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
  const deltaSeconds = (currentTime - gameLoop.previousTime)/MILLISECONDS_PER_SECOND;
  gameLoop.previousTime = currentTime;

  FrameRate.update();

  for (const asteroid of asteroids) {
    asteroid.move(deltaSeconds);
  }

  ship.move(deltaSeconds);
  if (ship.detectCollison(asteroids)) {
    reset();
  }

  // Laser logic, interates in reverse so that lasers can be removed.
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    if (ship.lasers[i].checkExpiration(currentTime)) {
      ship.lasers.splice(i, 1);
      scoreMultiplier = 1;
      continue;
    }
    ship.lasers[i].move(deltaSeconds);
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

function checkLineSegmentIntersection(p1, p2, p3, p4) {
  const line1 = {slope: null, intercept: null, vertical: false};
  const line2 = {slope: null, intercept: null, vertical: false};
  const intersectionPoint = {x: null, y: null};

  // Checks for vertical line.
  if (p2.x - p1.x === 0) {
    line1.vertical = true;
  } else {
    line1.slope = (p2.y - p1.y)/(p2.x - p1.x);
    line1.intercept = p1.y - line1.slope*p1.x;
  }
  console.log(line1);

  // Checks for vertical line.
  if (p4.x - p3.x === 0) {
    line2.vertical = true;
  } else {
    line2.slope = (p4.y - p3.y)/(p4.x - p3.x);
    line2.intercept = p3.y - line2.slope*p3.x;
  }
  console.log(line2);

  //
  if (!line1.vertical && !line2.vertical) {
    console.log(`neither line is vertical`);
    if (line1.slope === line2.slope) {
      return (p1.x <= Math.max(p3.x, p4.x) && p1.x >= Math.min(p3.x, p4.x)
        && p1.y <= Math.max(p3.y, p4.y) && p1.y >= Math.min(p3.y, p4.y))
        || (p2.x <= Math.max(p3.x, p4.x) && p2.x >= Math.min(p3.x, p4.x)
        && p2.y <= Math.max(p3.y, p4.y) && p2.y >= Math.min(p3.y, p4.y));
    } else {
      intersectionPoint.x = (line2.intercept - line1.intercept)/(line1.slope - line2.slope);
      intersectionPoint.y = line1.slope*intersectionPoint.x + line1.intercept;
      return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
        && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y);
    }
  //
  } else if (!line1.vertical && line2.vertical) {
    console.log(`line2 is vertical`);
    intersectionPoint.x = p3.x;
    intersectionPoint.y = line1.slope*intersectionPoint.x + line1.intercept;
    return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
      && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y);
  //
  } else if (line1.vertical && !line2.vertical) {
    console.log(`line1 is vertical`);
    intersectionPoint.x = p1.x;
    intersectionPoint.y = line2.slope*intersectionPoint.x + line2.intercept;
    return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
      && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y);
  //
  } else if (line1.vertical && line2.vertical) {
    console.log(`line1 and line2 is vertical`);
    return (p1.x <= Math.max(p3.x, p4.x) && p1.x >= Math.min(p3.x, p4.x)
      && p1.y <= Math.max(p3.y, p4.y) && p1.y >= Math.min(p3.y, p4.y))
      || (p2.x <= Math.max(p3.x, p4.x) && p2.x >= Math.min(p3.x, p4.x)
      && p2.y <= Math.max(p3.y, p4.y) && p2.y >= Math.min(p3.y, p4.y));
  }
}

const p1 = {x: 0, y: 0};
const p2 = {x: 0, y: 1};
const p3 = {x: 0, y: 0};
const p4 = {x: 3, y: 0};
console.log(checkLineSegmentIntersection(p1, p2, p3, p4));
