"use strict";

import {canvasSize, canvasScale} from "./ScaleCanvas.js";

const MILLISECONDS_PER_SECOND = 1000;

const ASTEROID_COLOR = `rgb(100, 100, 100)`;
const BASE_RADIUS = 25;
const BASE_SPEED = 360;
const NUMBER_OF_SIDES = 10;

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
    Object.defineProperty(this, `direction`,     {value: 2*Math.PI*Math.random()});
    Object.defineProperty(this, `rotationAngle`, {value: 0, writable: true});
    Object.defineProperty(this, `rotationSpeed`, {value: 2*Math.PI*Math.random() - Math.PI});
    const pointRadii = [];
    for (let i = 0; i < NUMBER_OF_SIDES; i++) {
      pointRadii.push((Math.random()/2 + 0.5)*this.radius);
    }
    Object.defineProperty(this, `pointRadii`, {value: pointRadii});
    const points = [];
    const interiorAngle = 2*Math.PI/NUMBER_OF_SIDES;
    for (let i = 0; i < NUMBER_OF_SIDES; i++) {
      points.push({
        x: canvasScale*(this.pointRadii[i]*Math.cos(interiorAngle*i) + this.x),
        y: canvasScale*(this.pointRadii[i]*Math.sin(interiorAngle*i) + this.y)
      });
    }
    Object.defineProperty(this, `points`, {value: points, writable: true});
    Object.seal(this);
  }

  /**
   * Changes the x and y coordinates based on the direction and speed. Also, rotates the asteroid according to the
   * rotation speed.
   * @param {number} deltaSeconds The amount of seconds that have passed since the last frame.
   */
  move(deltaSeconds) {
    this.rotationAngle += deltaSeconds*this.rotationSpeed;
    this.x += canvasScale*deltaSeconds*this.speed*Math.cos(this.direction);
    this.y += canvasScale*deltaSeconds*this.speed*Math.sin(this.direction);
    // Pac-Man logic
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;

    // Updates points.
    const points = [];
    const interiorAngle = 2*Math.PI/NUMBER_OF_SIDES;
    for (let i = 0; i < NUMBER_OF_SIDES; i++) {
      points.push({
        x: canvasScale*this.pointRadii[i]*Math.cos(interiorAngle*i + this.rotationAngle) + this.x,
        y: canvasScale*this.pointRadii[i]*Math.sin(interiorAngle*i + this.rotationAngle) + this.y
      });
    }
    this.points = points;
  }

  /**
   * Displays the asteroid by connecting all the points and filling it in.
   * @param {CanvasRenderingContext2D} context The canvas's 2D graphics context.
   */
  render(context) {
    context.beginPath();
    for (const point of this.points) {
      context.lineTo(point.x, point.y)
    }
    context.closePath();
    context.fillStyle = ASTEROID_COLOR;
    context.fill();
  }
}
