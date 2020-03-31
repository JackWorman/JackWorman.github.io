"use strict";

import {canvasSize, canvasScale} from "./ScaleCanvas.js";

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
    Object.defineProperty(this, `direction`,     {value: 2*Math.PI*Math.random()});

    this.randomX = [];
    this.randomY = [];
    for (let i = 0; i < 10; i++) {
      this.randomX.push(Math.random()/2 + 0.5);
      this.randomY.push(Math.random()/2 + 0.5);
    }

    Object.seal(this);
  }

  /**
   * Changes the x and y coordinates based on the direction and speed. Also, rotates the asteroid according to the
   * rotation speed.
   * @param  {number} deltaSeconds The amount of seconds that have passed since the last frame.
   */
  move(deltaSeconds) {
    this.rotationAngle += this.rotationSpeed * deltaSeconds;
    this.x += this.speed * deltaSeconds * Math.cos(this.direction) * canvasScale;
    this.y += this.speed * deltaSeconds * Math.sin(this.direction) * canvasScale;
    // Pac-Man logic
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
  }

  render(context) {
    const sides = 10;
    const interiorAngle = 2*Math.PI/sides;
    context.beginPath();
    context.translate(this.x, this.y);
    context.rotate(this.rotationAngle);
    context.moveTo(this.radius*this.randomX[0]*canvasScale, 0);
    for (let i = 1; i < sides; i++) {
      context.lineTo(
        this.radius*Math.cos(i*interiorAngle)*this.randomX[i]*canvasScale,
        this.radius*Math.sin(i*interiorAngle)*this.randomY[i]*canvasScale
      );
    }
    context.closePath();
    context.fillStyle = ASTEROID_COLOR;
    context.fill();
    context.rotate(-this.rotationAngle);
    context.translate(-this.x, -this.y);
  }
}
