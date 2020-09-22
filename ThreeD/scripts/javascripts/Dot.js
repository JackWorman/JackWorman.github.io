import PhysicsObject from './PhysicsObject.js';
export default class Dot extends PhysicsObject {
    constructor(physicsObject, radius, color) {
        super(physicsObject.mass, physicsObject.position, physicsObject.velocity);
        this.radius = radius;
        this.xProjected = 0;
        this.yProjected = 0;
        this.radiusProjected = 0;
        this.color = typeof (color) === 'undefined'
            ? `rgb(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`
            : color;
    }
    render(context, cameraPos) {
        const width = context.canvas.width;
        const height = context.canvas.height;
        this.project(width, height, cameraPos);
        if (this.position.z <= cameraPos.z) {
            return;
        }
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.xProjected, this.yProjected, this.radiusProjected, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }
    project(width, height, cameraPos) {
        const PROJECTION_CENTER_X = width / 2 + cameraPos.x;
        const PROJECTION_CENTER_Y = height / 2 + cameraPos.y;
        const FOV = (120 / 180) * Math.PI;
        const zProjected = (0.5 * width * Math.tan((Math.PI - FOV) / 2)) / (this.position.z - cameraPos.z);
        this.xProjected = this.position.x * zProjected + PROJECTION_CENTER_X;
        this.yProjected = this.position.y * zProjected + PROJECTION_CENTER_Y;
        const x2 = (this.position.x + this.radius) * zProjected + PROJECTION_CENTER_X;
        this.radiusProjected = x2 - this.xProjected;
    }
}
