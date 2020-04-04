"use strict";

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
    Object.defineProperty(this, `previousPoints`, {value: this.points, writable: true});
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
    this.previousPoints = this.points;
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
    // TODO: fix edge wrap bug
    // if (this.x < -1*100) return;
    // if (this.y < -1*100) return;
    // if (this.x >= 723 + 1*100) return;
    // if (this.y >= 723 + 1*100) return;

    const percentTimeLeft = (performance.now() - this.creationTime)/EXPIRATION_TIME;
    if (percentTimeLeft < 1/7) {
      context.fillStyle = `red`;
    } else if (percentTimeLeft < 2/7) {
      context.fillStyle = `orange`;
    } else if (percentTimeLeft < 3/7) {
      context.fillStyle = `yellow`;
    } else if (percentTimeLeft < 4/7) {
      context.fillStyle = `green`;
    } else if (percentTimeLeft < 5/7) {
      context.fillStyle = `aqua`;
    } else if (percentTimeLeft < 6/7) {
      context.fillStyle = `blue`;
    } else {
      context.fillStyle = `purple`;
    }

    context.beginPath();
    context.lineTo(this.points[0].x, this.points[0].y);
    context.lineTo(this.previousPoints[1].x, this.previousPoints[1].y);
    context.lineTo(this.previousPoints[2].x, this.previousPoints[2].y);
    context.lineTo(this.points[3].x, this.points[3].y);
    context.closePath();
    context.fill();
  }
}
