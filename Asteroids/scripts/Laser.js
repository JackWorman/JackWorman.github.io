"use strict";

import {checkCollison} from "./main.js"; // move collison detection from sprites
import Asteroid from "./Asteroid.js";

const MILLISECONDS_PER_SECOND = 1000;

const RAINBOW = [
  `rgb(255, 0, 0)`,
  `rgb(255, 127, 0)`,
  `rgb(255, 255, 0)`,
  `rgb(0, 255, 0)`,
  `rgb(0, 0, 255)`,
  `rgb(75, 0, 130)`,
  `rgb(148, 0, 211)`,
];
const MAXIMUM_ASTEROID_RADIUS = 100;
const EXPIRATION_TIME = 250;

export default class Laser {
  /**
   * @param {number} x     The horizontal coordinate.
   * @param {number} y     The vertical coordinate.
   * @param {number} speed The distance the laser travels in one second.
   * @param {number} angle The direction the laser travels.
   */
  constructor(x, y, speed, angle) {
    Object.defineProperty(this, `x`,            {value: x, writable: true});
    Object.defineProperty(this, `y`,            {value: y, writable: true});
    Object.defineProperty(this, `speed`,        {value: speed});
    Object.defineProperty(this, `angle`,        {value: angle});
    Object.defineProperty(this, `color`,        {value: Math.floor(RAINBOW.length*Math.random()), writable: true});
    Object.defineProperty(this, `creationTime`, {value: performance.now()});
    Object.defineProperty(this, `radius`,       {value: 10});
    Object.defineProperty(this, `radiusAnglePairs`, {value: [
      {radius: this.radius, angle: 1*Math.PI/25},
      {radius: this.radius, angle: 24*Math.PI/25},
      {radius: this.radius, angle: 26*Math.PI/25},
      {radius: this.radius, angle: 49*Math.PI/25},
    ]});
    Object.defineProperty(this, `points`, {value: (() => {
      const points = [];
      for (const radiusAnglePair of this.radiusAnglePairs) {
        points.push({
          x: 1*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle + this.angle) + this.x,
          y: 1*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle + this.angle) + this.y
        });
      }
      return points;
    })(), writable: true});

    Object.seal(this);
  }

  /**
   * Checks if the laser has existed longer than the expiration time.
   * @param  {number}  currentTime The current time in milliseconds.
   * @return {boolean}             True if the laser should expire, false otherwise.
   */
  checkExpiration(currentTime) {
    return currentTime - this.creationTime >= EXPIRATION_TIME;
  }

  /**
   * Changes the x and y coordinates according to the speed, angle, and time.
   * @param {number} deltaSeconds The number of seconds that have elapsed since the previous frame.
   */
  move(deltaSeconds, canvasSize, canvasScale) {
    const dx = canvasScale*deltaSeconds*this.speed*Math.cos(this.angle);
    const dy = canvasScale*deltaSeconds*this.speed*Math.sin(this.angle);
    this.x += dx;
    this.y += dy;
    // Logic connecting the edges of the screen.
    if (this.x < -canvasScale*100) this.x += canvasSize + canvasScale*200;
    if (this.y < -canvasScale*100) this.y += canvasSize + canvasScale*200;
    if (this.x >= canvasSize + canvasScale*100) this.x -= canvasSize + canvasScale*200;
    if (this.y >= canvasSize + canvasScale*100) this.y -= canvasSize + canvasScale*200;

    // Updates points.
    this.points = [];
    for (const radiusAnglePair of this.radiusAnglePairs) {
      this.points.push({
        x: canvasScale*radiusAnglePair.radius*Math.cos(radiusAnglePair.angle + this.angle) + this.x,
        y: canvasScale*radiusAnglePair.radius*Math.sin(radiusAnglePair.angle + this.angle) + this.y
      });
    }
  }

  /**
   * Displays the laser.
   * @param  {CanvasRenderingContext2D} context The 2D context used to interact with the canvas.
   */
  render(context) {
    context.beginPath();
    for (const point of this.points) {
      context.lineTo(point.x, point.y)
    }
    context.closePath();
    context.fillStyle = RAINBOW[this.color++ % RAINBOW.length];
    context.fill();
  }

  /**
   * Checks if the laser has collided with any of the asteroids.
   * @param  {array<Asteroid>} asteroids The list of all asteroid objects.
   * @return {boolean}                   Whether or not an asteroid was hit.
   */
  detectCollison(asteroids) {
    for (const [index, asteroid] of asteroids.entries()) {
      if (checkCollison(this.points, asteroid.points)) {
        if (asteroid.size > 0) {
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
          asteroids.push(new Asteroid(asteroid.x, asteroid.y, asteroid.size - 1));
        }
        asteroids.splice(index, 1); // Removes the element at 'index'.
        return true;
      }
    }
    return false;
  }
}
