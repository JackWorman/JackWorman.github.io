export default class Bullet {
  constructor(x, y, speed, angle) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
  }

  move(canvasSize) {
    this.x = this.x + this.speed * Math.cos(this.angle);
    this.y = this.y + this.speed * Math.sin(this.angle);
    return this.x < 0 || this.y < 0 || this.x >= canvasSize || this.y >= canvasSize;
  }

  render(context) {
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-10, -2);
    context.lineTo(10, -2);
    context.lineTo(10, 2);
    context.lineTo(-10, 2);
    context.closePath();
    context.fillStyle = 'rgb(0, 255, 0)';
    context.fill();

    context.rotate(-this.angle);
    context.translate(-this.x, -this.y);
  }
}
