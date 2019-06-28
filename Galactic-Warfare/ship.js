'use strict';

import Bullet from './bullet.js';

export default class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.direction = 0;
    this.bullets = [];
  }

  render(context, mousePos) {
    var size = 20;
    var angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x) - Math.PI/2;
    if (angle < 0) {
      angle = angle + 2 * Math.PI;
    }
    var centerY = (size * Math.tan(67.5 * Math.PI / 180) + size * Math.tan(22.5 * Math.PI / 180)) / 3;
    context.translate(this.x, this.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(-size, -centerY);
    context.lineTo(0, size * Math.tan(67.5 * Math.PI / 180) - centerY);
    context.lineTo(size, -centerY);
    context.lineTo(0, size * Math.tan(22.5 * Math.PI / 180) - centerY);
    context.closePath();
    context.fillStyle = 'rgb(255, 0, 0)';
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
    if (angle < 0) {
      angle = angle + 2 * Math.PI;
    }
    if (xDirection !== 0 || yDirection !== 0) {
      this.x = this.x + this.speed * Math.cos(angle);
      this.y = this.y + this.speed * Math.sin(angle);
    }
    if (this.x < 0) this.x += canvasSize;
    if (this.y < 0) this.y += canvasSize;
    if (this.x >= canvasSize) this.x -= canvasSize;
    if (this.y >= canvasSize) this.y -= canvasSize;
  }

  shoot(inputs) {
    if (inputs['leftMouseDown']) {
      var angle = Math.atan2(inputs["mousePos"].y - this.y, inputs["mousePos"].x - this.x);
      if (angle < 0) {
        angle = angle + 2 * Math.PI;
      }
      this.bullets.push(new Bullet(this.x, this.y, 40, angle));
    }
  }
}
