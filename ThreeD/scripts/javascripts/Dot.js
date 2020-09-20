import { PhysicsObject } from './PhysicsObject.js';
export class Dot extends PhysicsObject {
    constructor(physicsObject, radius) {
        super(physicsObject.position, physicsObject.velocity, physicsObject.acceleration, physicsObject.jerk);
        this.radius = radius;
        this.xProjected = 0;
        this.yProjected = 0;
        this.scaleProjected = 0;
        this.color = `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()})`;
    }
    render(context) {
        const width = context.canvas.width;
        const height = context.canvas.height;
        this.project(width, height);
        if (this.scaleProjected <= 0) {
            return;
        }
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.xProjected, this.yProjected, this.radius * this.scaleProjected, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }
    project(width, height) {
        const PERSPECTIVE = width * 0.7;
        const PROJECTION_CENTER_X = width / 2;
        const PROJECTION_CENTER_Y = height / 2;
        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.position.z);
        this.xProjected = (this.position.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.position.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }
}
