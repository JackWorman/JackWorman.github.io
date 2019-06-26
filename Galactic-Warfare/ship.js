export default class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.direction = 0;
    this.dx = 0;
    this.dy = 0;
    this.d2x = 0;
    this.d2y = 0;
  }

  render(context, mousePos) {
    var size = 20;
    var angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x) - Math.PI/2;
    if (angle < 0) {
      angle = angle + 2 * Math.PI;
    }
    var centerY = (size * Math.tan(67.5 * Math.PI / 180) + size * Math.tan(22.5 * Math.PI / 180)) / 3;
    context.translate(this.x, this.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(-size, -centerY);
    context.lineTo(0, size * Math.tan(67.5 * Math.PI / 180) - centerY);
    context.lineTo(size, -centerY);
    context.lineTo(0, size * Math.tan(22.5 * Math.PI / 180) - centerY);
    context.closePath();
    context.fillStyle = 'rgb(255, 0, 0)';
    context.fill();
    context.rotate(-angle);
    context.translate(-this.x, -this.y);
  }

  move(context) {
    var angle = Math.atan2(this.dy, this.dx);
    if (angle < 0) {
      angle = angle + 2 * Math.PI;
    }
    if (this.dx !== 0 || this.dy !== 0) {
      this.x = this.x + this.speed * Math.cos(angle);
      this.y = this.y + this.speed * Math.sin(angle);
    }
  }
}
