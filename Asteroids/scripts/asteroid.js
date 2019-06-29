'use strict';

const GRAY = 'rgb(100, 100, 100)';
const BASE_RADIUS = 25;
const BASE_SPEED = 6;

export default class Asteroid {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.radius = BASE_RADIUS * Math.pow(2, size);
    this.speed = BASE_SPEED / Math.pow(2, size);
    this.rotationAngle = 0;
    this.rotationSpeed = Math.random() * 0.05 - 0.025;
    this.angle = Math.random() * 2 * Math.PI;
  }

  move(canvasSize) {
    this.x = this.x + this.speed * Math.cos(this.angle);
    this.y = this.y + this.speed * Math.sin(this.angle);
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
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
    context.fillStyle = GRAY;
    context.fill();
    context.rotate(-this.rotationAngle);
    context.translate(-this.x, -this.y);
    this.rotationAngle += this.rotationSpeed;
  }
}
