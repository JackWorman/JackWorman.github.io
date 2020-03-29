"use strict";

import Laser from "./laser.js";
import {userInputs} from "./UserInputs.js";
import {KeyCodes} from "./KeyCodes.js";

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

  render(context) {
    const size = 15;
    const angle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x) - Math.PI / 2;
    const centerY = (size * Math.tan(67.5 * Math.PI / 180) + size * Math.tan(22.5 * Math.PI / 180)) / 3;
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

  move(canvasSize, deltaTime) {
    // if (inputs[16]) {
    //   this.speed = 600;
    // } else {
    //   this.speed = 300;
    // }
    let xDirection = 0;
    let yDirection = 0;
    if (userInputs[KeyCodes.A] || userInputs[KeyCodes.LeftArrow]) xDirection--;
    if (userInputs[KeyCodes.D] || userInputs[KeyCodes.RightArrow]) xDirection++;
    if (userInputs[KeyCodes.W] || userInputs[KeyCodes.UpArrow]) yDirection--;
    if (userInputs[KeyCodes.S] || userInputs[KeyCodes.DownArrow]) yDirection++;
    const angle = Math.atan2(yDirection, xDirection);
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

  shoot(currentTime) {
    if (
      (userInputs[`leftMouseDown`] || userInputs[`rightMouseDown`] || userInputs[32])
      && currentTime - this.timeOfLastShot > this.shootRate
    ) {
      this.timeOfLastShot = performance.now();
      const angle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 2400, angle));
    }
  }

  detectCollison(asteroids) {
    for (let i = 0; i < asteroids.length; i++) {
      const distance = Math.sqrt(Math.pow(this.x - asteroids[i].x, 2) + Math.pow(this.y - asteroids[i].y, 2));
      if (distance < asteroids[i].radius) {
        return true;
      }
    }
    return false;
  }
}
