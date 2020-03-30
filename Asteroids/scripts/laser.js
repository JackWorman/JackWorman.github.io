"use strict";

import Asteroid from "./asteroid.js";
import {canvasSize} from "./ScaleCanvas.js";

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
    Object.seal(this);
  }

  /**
   * Checks if the laser has existed longer than the expiration time.
   * @param  {number} currentTime The current time in milliseconds.
   * @return {boolean}            True if the laser should expire, false otherwise.
   */
  checkExpiration(currentTime) {
    return currentTime - this.creationTime >= EXPIRATION_TIME;
  }

  /**
   * Changes the x and y coordinates according to the speed, angle, and time.
   * @param  {number} deltaTime The number of milliseconds since the last frame.
   */
  move(deltaTime) {
    const dx = this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.cos(this.angle);
    const dy = this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.sin(this.angle);
    this.x += dx;
    this.y += dy;
    // Logic connecting the edges of the screen.
    // TODO: move this to one screen further, then only calculate this when rendering?
    if (this.x < -MAXIMUM_ASTEROID_RADIUS) this.x += canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.y < -MAXIMUM_ASTEROID_RADIUS) this.y += canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.x >= canvasSize + MAXIMUM_ASTEROID_RADIUS) this.x -= canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.y >= canvasSize + MAXIMUM_ASTEROID_RADIUS) this.y -= canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
  }

  /**
   * Displays the laser.
   * @param  {???} context The 2D context used to interact with the canvas.
   */
  render(context) {
    const length = 40;
    const width = 2;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-length, -width);
    context.lineTo(length, -width);
    context.lineTo(length, width);
    context.lineTo(-length, width);
    context.closePath();
    context.fillStyle = RAINBOW[this.color++ % RAINBOW.length];
    context.fill();
    context.restore();
  }

  /**
   * Checks if the laser has collided with any of the asteroids.
   * @param  {array}   asteroids The list of all asteroid objects.
   * @return {boolean}           Whether or not an asteroid was hit.
   */
  detectCollison(asteroids) {
    for (const [index, asteroid] of asteroids.entries()) {
      const distance = Math.sqrt(Math.pow(this.x - asteroid.x, 2) + Math.pow(this.y - asteroid.y, 2));
      if (distance < asteroid.radius) {
        if (asteroid.size !== 0) {
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
