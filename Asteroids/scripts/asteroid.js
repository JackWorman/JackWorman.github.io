"use strict";

const MILLISECONDS_PER_SECOND = 1000;

const ASTEROID_COLOR = `rgb(100, 100, 100)`;
const BASE_RADIUS = 25;
const BASE_SPEED = 360;

export default class Asteroid {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.radius = BASE_RADIUS * Math.pow(2, size);
    this.speed = BASE_SPEED / Math.pow(2, size);
    this.rotationAngle = 0;
    this.rotationSpeed = 0.05*Math.random() - 0.025;
    this.angle = 2*Math.PI*Math.random() ;
  }

  move(canvasSize, deltaTime) {
    this.x += this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.cos(this.angle);
    this.y += this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.sin(this.angle);
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
  }

  render(context) {
    const sides = 10;
    const angle = 2*Math.PI/sides;
    context.beginPath();
    context.translate(this.x, this.y);
    context.rotate(this.rotationAngle);
    context.moveTo(this.radius, 0);
    for (let i = 1; i < sides; i++) {
      context.lineTo(this.radius * Math.cos(angle * i), this.radius * Math.sin(angle * i));
    }
    context.closePath();
    context.fillStyle = ASTEROID_COLOR;
    context.fill();
    context.rotate(-this.rotationAngle);
    context.translate(-this.x, -this.y);
    this.rotationAngle += this.rotationSpeed;
  }
}
