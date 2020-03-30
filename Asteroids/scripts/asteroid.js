"use strict";

const MILLISECONDS_PER_SECOND = 1000;

const ASTEROID_COLOR = `rgb(100, 100, 100)`;
const BASE_RADIUS = 25;
const BASE_SPEED = 360;

export default class Asteroid {
  /**
   * @param {number} x    The horizontal coordinate.
   * @param {number} y    The vertical coordinate.
   * @param {number} size The size cooresponding to a specific radius.
   */
  constructor(x, y, size) {
    Object.defineProperty(this, `x`,             {value: x, writable: true});
    Object.defineProperty(this, `y`,             {value: y, writable: true});
    Object.defineProperty(this, `size`,          {value: size});
    Object.defineProperty(this, `radius`,        {value: BASE_RADIUS*Math.pow(2, size)});
    Object.defineProperty(this, `speed`,         {value: BASE_SPEED/Math.pow(2, size)});
    Object.defineProperty(this, `rotationAngle`, {value: 0, writable: true});
    Object.defineProperty(this, `rotationSpeed`, {value: 2*Math.PI*Math.random() - Math.PI});
    Object.defineProperty(this, `angle`,         {value: 2*Math.PI*Math.random()});
    Object.seal(this);
  }

  move(canvasSize, deltaTime) {
    const deltaTimeInSeconds = deltaTime/MILLISECONDS_PER_SECOND;
    this.rotationAngle += this.rotationSpeed * deltaTimeInSeconds;
    this.x += this.speed * deltaTimeInSeconds * Math.cos(this.angle);
    this.y += this.speed * deltaTimeInSeconds * Math.sin(this.angle);
    // Pac-Man logic
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
  }
}
