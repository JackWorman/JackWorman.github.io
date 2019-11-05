"use strict";

import Laser from "./laser.js";

const SHIP_COLOR = `rgb(255, 255, 255)`;
const MILLISECONDS_PER_SECOND = 1000;

export default class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 300;
    this.direction = 0;
    this.lasers = [];
    this.shootRate = 500;
    this.timeOfLastShot = -this.shootRate;
  }

  render(context, mousePos) {
    let size = 15;
    let angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x) - Math.PI / 2;
    let centerY = (size * Math.tan(67.5 * Math.PI / 180) + size * Math.tan(22.5 * Math.PI / 180)) / 3;
    context.translate(this.x, this.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(-size, -centerY);
    context.lineTo(0, size * Math.tan(67.5 * Math.PI / 180) - centerY);
    context.lineTo(size, -centerY);
    context.lineTo(0, size * Math.tan(22.5 * Math.PI / 180) - centerY);
    context.closePath();
    context.fillStyle = SHIP_COLOR;
    context.fill();
    context.rotate(-angle);
    context.translate(-this.x, -this.y);
  }

  move(inputs, canvasSize, deltaTime) {
    if (inputs[16]) {
      this.speed = 600;
    } else {
      this.speed = 300;
    }
    let xDirection = 0;
    let yDirection = 0;
    if (inputs[65] || inputs[37]) xDirection--;
    if (inputs[68] || inputs[39]) xDirection++;
    if (inputs[87] || inputs[38]) yDirection--;
    if (inputs[83] || inputs[40]) yDirection++;
    let angle = Math.atan2(yDirection, xDirection);
    if (xDirection !== 0 || yDirection !== 0) {
      this.x += this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.cos(angle);
      this.y += this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.sin(angle);
    }
    // Detect if the ship went off the map.
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
  }

  shoot(inputs) {
    if ((inputs[`leftMouseDown`] || inputs[`rightMouseDown`] || inputs[32]) && performance.now() - this.timeOfLastShot > this.shootRate) {
      this.timeOfLastShot = performance.now();
      let angle = Math.atan2(inputs[`mousePos`].y - this.y, inputs[`mousePos`].x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 2400, angle));
    }
  }

  detectCollison(asteroids) {
    for (let i = 0; i < asteroids.length; i++) {
      let distance = Math.sqrt(Math.pow(this.x - asteroids[i].x, 2) + Math.pow(this.y - asteroids[i].y, 2));
      if (distance < asteroids[i].radius) {
        return true;
      }
    }
    return false;
  }
}
