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
    context.fillStyle = 'rgb(0, 255, 0)';
    context.fill();

    context.rotate(-this.angle);
    context.translate(-this.x, -this.y);
  }
}
