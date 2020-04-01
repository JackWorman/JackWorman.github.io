"use strict";

import {checkCollison} from "./main.js";
import Laser from "./laser.js";
import {userInputs} from "./UserInputs.js";
import {KeyCodes} from "./KeyCodes.js";
import {canvasSize, canvasScale} from "./ScaleCanvas.js";

const MILLISECONDS_PER_SECOND = 1000;

const SHIP_COLOR = `rgb(255, 255, 255)`;

export default class Ship {
  constructor(x, y) {
    Object.defineProperty(this, `x`,              {value: x, writable: true});
    Object.defineProperty(this, `y`,              {value: y, writable: true});
    Object.defineProperty(this, `radius`,         {value: 20});
    Object.defineProperty(this, `speed`,          {value: 300});
    Object.defineProperty(this, `direction`,      {value: 0, writable: true});
    Object.defineProperty(this, `lasers`,         {value: []});
    Object.defineProperty(this, `shootRate`,      {value: 500});
    Object.defineProperty(this, `timeOfLastShot`, {value: 0, writable: true});
    const radiusAnglePairs = [
      {radius: this.radius,   angle: 0},
      {radius: this.radius,   angle: 7*Math.PI/9},
      {radius: this.radius/2, angle: Math.PI},
      {radius: this.radius,   angle: 11*Math.PI/9},
    ];
    Object.defineProperty(this, `radiusAnglePairs`, {value: radiusAnglePairs});
    const points = [];
    for (const radiusAnglePair of this.radiusAnglePairs) {
      points.push({
        x: canvasScale*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle) + this.x,
        y: canvasScale*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle) + this.y
      });
    }
    Object.defineProperty(this, `points`, {value: points, writable: true});
    Object.seal(this);
  }

  render(context) {
    context.beginPath();
    for (const point of this.points) {
      context.lineTo(point.x, point.y)
    }
    context.closePath();
    context.fillStyle = SHIP_COLOR;
    context.fill();
  }

  move(deltaTime) {
    let xDirection = 0;
    let yDirection = 0;
    if (userInputs[KeyCodes.A] || userInputs[KeyCodes.LeftArrow]) xDirection--;
    if (userInputs[KeyCodes.D] || userInputs[KeyCodes.RightArrow]) xDirection++;
    if (userInputs[KeyCodes.W] || userInputs[KeyCodes.UpArrow]) yDirection--;
    if (userInputs[KeyCodes.S] || userInputs[KeyCodes.DownArrow]) yDirection++;
    const direction = Math.atan2(yDirection, xDirection);
    if (xDirection !== 0 || yDirection !== 0) {
      this.x += canvasScale*deltaTime*this.speed*Math.cos(direction);
      this.y += canvasScale*deltaTime*this.speed*Math.sin(direction);
    }
    // Detect if the ship went off the map. Pac-Man logic
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;

    // Updates points.
    const rotationAngle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x);
    this.points = [];
    for (const radiusAnglePair of this.radiusAnglePairs) {
      this.points.push({
        x: canvasScale*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle + rotationAngle) + this.x,
        y: canvasScale*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle + rotationAngle) + this.y
      });
    }
  }

  shoot(currentTime) {
    if (
      (userInputs[`leftMouseDown`] || userInputs[`rightMouseDown`] || userInputs[32])
      && currentTime - this.timeOfLastShot > this.shootRate
    ) {
      this.timeOfLastShot = currentTime;
      const angle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 2400, angle));
    }
  }

  detectCollison(asteroids) {
    for (const asteroid of asteroids) {
      if (checkCollison(this.points, asteroid.points)) {
        return true;
      }
    }
    return false;
  }
}
