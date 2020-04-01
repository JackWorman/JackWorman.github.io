"use strict";

import {checkCollison} from "./main.js";
import Laser from "./laser.js";
import * as Controls from "./Controls.js";

const SHIP_COLOR = `rgb(0, 255, 0)`;

export default class Ship {
  // TODO: add health, 3 hits per game, change color to represent health, green->yellow->red
  constructor(x, y) {
    Object.defineProperty(this, `x`,              {value: x, writable: true});
    Object.defineProperty(this, `y`,              {value: y, writable: true});
    Object.defineProperty(this, `radius`,         {value: 20});
    Object.defineProperty(this, `speed`,          {value: 300});
    Object.defineProperty(this, `direction`,      {value: 0, writable: true});
    Object.defineProperty(this, `lasers`,         {value: []});
    Object.defineProperty(this, `shootRate`,      {value: 500});
    Object.defineProperty(this, `timeOfLastShot`, {value: 0, writable: true});
    Object.defineProperty(this, `radiusAnglePairs`, {value: [
      {radius: this.radius,   angle: 0},
      {radius: this.radius,   angle: 7*Math.PI/9},
      {radius: this.radius/2, angle: Math.PI},
      {radius: this.radius,   angle: 11*Math.PI/9},
    ]});
    Object.defineProperty(this, `points`, {value: (() => {
      const rotationAngle = Math.atan2(Controls.CursorPosition().y - this.y, Controls.CursorPosition().x - this.x);
      const points = [];
      for (const radiusAnglePair of this.radiusAnglePairs) {
        points.push({
          x: 1*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle + rotationAngle) + this.x,
          y: 1*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle + rotationAngle) + this.y
        });
      }
      return points;
    })(), writable: true});
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

  move(deltaTime, canvasSize, canvasScale) {
    let xDirection = 0;
    let yDirection = 0;
    if (Controls.Left())  xDirection--;
    if (Controls.Right()) xDirection++;
    if (Controls.Up())    yDirection--;
    if (Controls.Down())  yDirection++;
    const direction = Math.atan2(yDirection, xDirection);
    if (xDirection !== 0 || yDirection !== 0) {
      this.x += canvasScale*deltaTime*this.speed*Math.cos(direction);
      this.y += canvasScale*deltaTime*this.speed*Math.sin(direction);
    }
    // Detect if the ship went off the map. Pac-Man logic
    if (this.x < -canvasScale*100) this.x += canvasSize + canvasScale*200;
    if (this.y < -canvasScale*100) this.y += canvasSize + canvasScale*200;
    if (this.x >= canvasSize + canvasScale*100) this.x -= canvasSize + canvasScale*200;
    if (this.y >= canvasSize + canvasScale*100) this.y -= canvasSize + canvasScale*200;

    // Updates points.
    const rotationAngle = Math.atan2(Controls.CursorPosition().y - this.y, Controls.CursorPosition().x - this.x);
    this.points = [];
    for (const radiusAnglePair of this.radiusAnglePairs) {
      this.points.push({
        x: canvasScale*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle + rotationAngle) + this.x,
        y: canvasScale*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle + rotationAngle) + this.y
      });
    }
  }

  shoot(currentTime) {
    if (Controls.Shoot() && currentTime - this.timeOfLastShot > this.shootRate) {
      this.timeOfLastShot = currentTime;
      const angle = Math.atan2(Controls.CursorPosition().y - this.y, Controls.CursorPosition().x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 2400, angle));
      (new Audio(`./sounds/laser.wav`)).play();
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
