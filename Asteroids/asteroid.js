'use strict';

export default class Asteroid {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotationAngle = 0;
    this.rotationSpeed = Math.random() * 0.02 - 0.01;
    this.speed = speed;
    this.angle = Math.random() * 2 * Math.PI;
  }

  move(canvasSize) {
    this.x = this.x + this.speed * Math.cos(this.angle);
    this.y = this.y + this.speed * Math.sin(this.angle);
    if (this.x < 0) this.x += canvasSize;
    if (this.y < 0) this.y += canvasSize;
    if (this.x >= canvasSize) this.x -= canvasSize;
    if (this.y >= canvasSize) this.y -= canvasSize;
  }

  render(context) {
    var sides = 10;
    context.beginPath();
    var angle = Math.PI * 2 / sides;
    context.translate(this.x, this.y);
    context.rotate(this.rotationAngle);
    context.moveTo(this.radius, 0);
    for (var i = 1; i < sides; i++) {
      context.lineTo(this.radius * Math.cos(angle * i), this.radius * Math.sin(angle * i));
    }
    context.closePath();
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fill();
    context.rotate(-this.rotationAngle);
    context.translate(-this.x, -this.y);
    this.rotationAngle += this.rotationSpeed;
  }
}
