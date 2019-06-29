'use strict';

const GREEN = 'rgb(0, 255, 0)';
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
    this.color = 0;
  }

  move(canvasSize) {
    this.x = this.x + this.speed * Math.cos(this.angle);
    this.y = this.y + this.speed * Math.sin(this.angle);
    // return this.x < 0 || this.y < 0 || this.x >= canvasSize || this.y >= canvasSize;
    if (this.x < 0) this.x += canvasSize;
    if (this.y < 0) this.y += canvasSize;
    if (this.x >= canvasSize) this.x -= canvasSize;
    if (this.y >= canvasSize) this.y -= canvasSize;
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
        asteroids.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
