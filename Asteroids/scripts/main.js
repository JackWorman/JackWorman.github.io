"use strict";

import Ship from "./ship.js";
import Asteroid from "./asteroid.js";
import * as FrameRate from "./FrameRate.js";
import * as Score from "./Score.js";
import {canvasSize, canvasScale, scaleCanvas} from "./ScaleCanvas.js";

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

  if (ship.detectCollison(asteroids)) {
    // (new Audio(`./sounds/hit-sound.wav`)).play();
    if (ship.health === 0) {
      reset();
    }
    ship.health--;
  }

  // Laser logic, interates in reverse so that lasers can be removed.
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    if (ship.lasers[i].checkExpiration(currentTime)) {
      ship.lasers.splice(i, 1);
      scoreMultiplier = 1;
      continue;
    }
    if (ship.lasers[i].detectCollison(asteroids)) { // Laser hit an asteroid
      Score.update(asteroids.length * scoreMultiplier);
      scoreMultiplier++;
      ship.lasers.splice(i, 1);
    }
  }

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

// TODO: detect if a shape is completely inside the other
export function checkCollison(points1, points2) {
  // Create line segments from points.
  const lineSegments1 = [];
  for (let i = 0; i < points1.length - 1; i++) {
    lineSegments1.push([points1[i], points1[i + 1]]);
  }
  lineSegments1.push([points1[points1.length - 1], points1[0]]);
  const lineSegments2 = [];
  for (let i = 0; i < points2.length - 1; i++) {
    lineSegments2.push([points2[i], points2[i + 1]]);
  }
  lineSegments2.push([points2[points2.length - 1], points2[0]]);

  // test each set of line segments
  for (const lineSegment1 of lineSegments1) {
    for (const lineSegment2 of lineSegments2) {
      if (checkIntersection(...lineSegment1, ...lineSegment2)) {
        return true;
      }
    }
  }
  return false;
}

function checkIntersection(p1, p2, p3, p4) {
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

  // Checks for vertical line.
  if (p4.x - p3.x === 0) {
    line2.vertical = true;
  } else {
    line2.slope = (p4.y - p3.y)/(p4.x - p3.x);
    line2.intercept = p3.y - line2.slope*p3.x;
  }

  //
  if (!line1.vertical && !line2.vertical) {
    if (line1.slope === line2.slope) {
      return (p1.x <= Math.max(p3.x, p4.x) && p1.x >= Math.min(p3.x, p4.x)
        && p1.y <= Math.max(p3.y, p4.y) && p1.y >= Math.min(p3.y, p4.y))
        || (p2.x <= Math.max(p3.x, p4.x) && p2.x >= Math.min(p3.x, p4.x)
        && p2.y <= Math.max(p3.y, p4.y) && p2.y >= Math.min(p3.y, p4.y));
    } else {
      intersectionPoint.x = (line2.intercept - line1.intercept)/(line1.slope - line2.slope);
      intersectionPoint.y = line1.slope*intersectionPoint.x + line1.intercept;
      return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
        && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y)
        && intersectionPoint.x <= Math.max(p3.x, p4.x) && intersectionPoint.x >= Math.min(p3.x, p4.x)
        && intersectionPoint.y <= Math.max(p3.y, p4.y) && intersectionPoint.y >= Math.min(p3.y, p4.y);
    }
  //
  } else if (!line1.vertical && line2.vertical) {
    intersectionPoint.x = p3.x;
    intersectionPoint.y = line1.slope*intersectionPoint.x + line1.intercept;
    return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
      && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y);
  //
  } else if (line1.vertical && !line2.vertical) {
    intersectionPoint.x = p1.x;
    intersectionPoint.y = line2.slope*intersectionPoint.x + line2.intercept;
    return intersectionPoint.x <= Math.max(p1.x, p2.x) && intersectionPoint.x >= Math.min(p1.x, p2.x)
      && intersectionPoint.y <= Math.max(p1.y, p2.y) && intersectionPoint.y >= Math.min(p1.y, p2.y);
  //
  } else if (line1.vertical && line2.vertical) {
    return (p1.x <= Math.max(p3.x, p4.x) && p1.x >= Math.min(p3.x, p4.x)
      && p1.y <= Math.max(p3.y, p4.y) && p1.y >= Math.min(p3.y, p4.y))
      || (p2.x <= Math.max(p3.x, p4.x) && p2.x >= Math.min(p3.x, p4.x)
      && p2.y <= Math.max(p3.y, p4.y) && p2.y >= Math.min(p3.y, p4.y));
  }
}

// const p1 = {x: 376.63922397555547, y: 375.3790090214039};
// const p2 = {x: 341.8646649860681, y: 361.0112286938371};
// const p3 = {x: -52.01140653648993, y: 514.8599622552507};
// const p4 = {x: 4.999265538515136, y: 495.8272648274736};
// console.log(checkIntersection(p1, p2, p3, p4));
// alert();
