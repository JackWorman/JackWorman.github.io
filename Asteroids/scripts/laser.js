'use strict';

import Asteroid from './asteroid.js';

const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
];
const MAXIMUM_ASTEROID_RADIUS = 100;
const MILLISECONDS_PER_SECOND = 1000;

export default class Laser {
  constructor(x, y, speed, angle) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.distance = 0;
    this.color = Math.floor(Math.random() * 7);
  }

  move(canvasSize, deltaTime) {
    var dx = this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.cos(this.angle);
    var dy = this.speed * deltaTime / MILLISECONDS_PER_SECOND * Math.sin(this.angle);
    this.x += dx;
    this.y += dy;
    if (this.x < -MAXIMUM_ASTEROID_RADIUS) this.x += canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.y < -MAXIMUM_ASTEROID_RADIUS) this.y += canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.x >= canvasSize + MAXIMUM_ASTEROID_RADIUS) this.x -= canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    if (this.y >= canvasSize + MAXIMUM_ASTEROID_RADIUS) this.y -= canvasSize + MAXIMUM_ASTEROID_RADIUS * 2;
    this.distance += Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return this.distance > canvasSize * 2 / 3;
  }

  render(context) {
    var length = 40;
    var width = 2;
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-length, -width);
    context.lineTo(length, -width);
    context.lineTo(length, width);
    context.lineTo(-length, width);
    context.closePath();
    context.fillStyle =  RAINBOW[this.color++ % RAINBOW.length];;
    context.fill();
    context.rotate(-this.angle);
    context.translate(-this.x, -this.y);
  }

  detectCollison(asteroids) {
    for (var i = 0; i < asteroids.length; i++) {
      var distance = Math.sqrt(Math.pow(this.x - asteroids[i].x, 2) + Math.pow(this.y - asteroids[i].y, 2));
      if (distance < asteroids[i].radius) {
        if (asteroids[i].size !== 0) {
          asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, asteroids[i].size - 1));
          asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, asteroids[i].size - 1));
        }
        asteroids.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
