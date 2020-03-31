"use strict";

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
    Object.defineProperty(this, `speed`,          {value: 300});
    Object.defineProperty(this, `direction`,      {value: 0, writable: true});
    Object.defineProperty(this, `lasers`,         {value: []});
    Object.defineProperty(this, `shootRate`,      {value: 500});
    Object.defineProperty(this, `timeOfLastShot`, {value: 0, writable: true});
    Object.seal(this);
  }

  render(context) {
    const size = 15*canvasScale;
    const angle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x) - Math.PI/2;
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

  move(deltaTime) {
    let xDirection = 0;
    let yDirection = 0;
    if (userInputs[KeyCodes.A] || userInputs[KeyCodes.LeftArrow]) xDirection--;
    if (userInputs[KeyCodes.D] || userInputs[KeyCodes.RightArrow]) xDirection++;
    if (userInputs[KeyCodes.W] || userInputs[KeyCodes.UpArrow]) yDirection--;
    if (userInputs[KeyCodes.S] || userInputs[KeyCodes.DownArrow]) yDirection++;
    const angle = Math.atan2(yDirection, xDirection);
    if (xDirection !== 0 || yDirection !== 0) {
      this.x += this.speed * deltaTime * Math.cos(angle) * canvasScale;
      this.y += this.speed * deltaTime * Math.sin(angle) * canvasScale;
    }
    // Detect if the ship went off the map. Pac-Man logic
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
      this.timeOfLastShot = currentTime;
      const angle = Math.atan2(userInputs[`mousePosition`].y - this.y, userInputs[`mousePosition`].x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 2400, angle));
    }
  }

  detectCollison(asteroids) {
    for (const asteroid of asteroids) {
      const distance = Math.sqrt(Math.pow(this.x - asteroid.x, 2) + Math.pow(this.y - asteroid.y, 2));
      if (distance < asteroid.radius*canvasScale) {
        return true;
      }
    }
    return false;
  }
}
