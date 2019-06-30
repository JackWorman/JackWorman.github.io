'use strict';

import Laser from './laser.js';

const WHITE = 'rgb(255, 255, 255)';

export default class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.direction = 0;
    this.lasers = [];
    this.shootTime = 0;
  }

  render(context, mousePos) {
    var size = 15;
    var angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x) - Math.PI/2;
    var centerY = (size * Math.tan(67.5 * Math.PI / 180) + size * Math.tan(22.5 * Math.PI / 180)) / 3;
    context.translate(this.x, this.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(-size, -centerY);
    context.lineTo(0, size * Math.tan(67.5 * Math.PI / 180) - centerY);
    context.lineTo(size, -centerY);
    context.lineTo(0, size * Math.tan(22.5 * Math.PI / 180) - centerY);
    context.closePath();
    context.fillStyle = WHITE;
    context.fill();
    context.rotate(-angle);
    context.translate(-this.x, -this.y);
  }

  move(inputs, canvasSize) {
    if (inputs[16]) {
      this.speed = 10;
    } else {
      this.speed = 5;
    }
    var xDirection = 0;
    var yDirection = 0;
    if (inputs[65]) xDirection--;
    if (inputs[68]) xDirection++;
    if (inputs[87]) yDirection--;
    if (inputs[83]) yDirection++;
    var angle = Math.atan2(yDirection, xDirection);
    if (xDirection !== 0 || yDirection !== 0) {
      this.x = this.x + this.speed * Math.cos(angle);
      this.y = this.y + this.speed * Math.sin(angle);
    }
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
  }

  shoot(inputs) {
    var downTime = 500;
    if ((inputs['leftMouseDown'] || inputs[32]) && Date.now() - this.shootTime > downTime) {
      this.shootTime = Date.now();
      var angle = Math.atan2(inputs["mousePos"].y - this.y, inputs["mousePos"].x - this.x);
      this.lasers.push(new Laser(this.x, this.y, 40, angle));
    }
  }

  detectCollison(asteroids) {
    for (var i = 0; i < asteroids.length; i++) {
      var distance = Math.sqrt(Math.pow(this.x - asteroids[i].x, 2) + Math.pow(this.y - asteroids[i].y, 2));
      if (distance < asteroids[i].radius) {
        return true;
      }
    }
    return false;
  }
}
