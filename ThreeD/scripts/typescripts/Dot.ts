import PhysicsObject from './PhysicsObject.js';
import Camera from "./Camera.js";

export default class Dot extends PhysicsObject {
    private readonly radius: number;
    private xProjected: number;
    private yProjected: number;
    private radiusProjected: number;
    private readonly color: string;

    constructor(physicsObject: PhysicsObject, radius: number, color?: string) {
        super(physicsObject.mass, physicsObject.position, physicsObject.velocity);

        this.radius = radius;
        this.xProjected = 0;
        this.yProjected = 0;
        this.radiusProjected = 0;
        this.color = typeof(color) === 'undefined'
            ? `rgb(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`
            : color;
    }

    render(context: CanvasRenderingContext2D, camera: Camera) {
        const width = context.canvas.width;
        const height = context.canvas.height;
        this.project(width, height, camera);
        if (this.position.z <= camera.position.z) {
            return;
        }

        context.fillStyle = this.color;

        context.beginPath();
        context.arc(this.xProjected, this.yProjected, this.radiusProjected, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    private project(width: number, height: number, camera: Camera) {
        const PROJECTION_CENTER_X = width / 2 + camera.position.x;
        const PROJECTION_CENTER_Y = height / 2 + camera.position.y;

        const zProjected = (0.5 * width * Math.tan((Math.PI - camera.fov) / 2)) / (this.position.z - camera.position.z);
        this.xProjected = this.position.x * zProjected + PROJECTION_CENTER_X;
        this.yProjected = this.position.y * zProjected + PROJECTION_CENTER_Y;
        const x2 = (this.position.x + this.radius) * zProjected + PROJECTION_CENTER_X;
        this.radiusProjected = x2 - this.xProjected;
    }
}
