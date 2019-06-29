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

export default class Laser {
  constructor(x, y, speed, angle) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.distance = 0;
    this.color = 0;
  }

  move(canvasSize) {
    var dx = this.speed * Math.cos(this.angle);
    var dy = this.speed * Math.sin(this.angle);
    this.distance += Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    this.x = this.x + dx;
    this.y = this.y + dy;
    if (this.x < -100) this.x += canvasSize + 200;
    if (this.y < -100) this.y += canvasSize + 200;
    if (this.x >= canvasSize + 100) this.x -= canvasSize + 200;
    if (this.y >= canvasSize + 100) this.y -= canvasSize + 200;
    return this.distance > canvasSize * 7 / 8;
  }

  render(context) {
    var length = 20;
    var width = 2;
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
