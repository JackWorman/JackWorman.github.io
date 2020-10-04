import PhysicsObject from './PhysicsObject.js';
import Camera from "./Camera.js";
import Vector3D from "./Vector3D.js";

export default class Sphere extends PhysicsObject {
    private readonly radius: number;
    private xProjected: number;
    private yProjected: number;
    private radiusProjected: number;
    private readonly color: string;

    constructor(mass: number, position: Vector3D, velocity: Vector3D, radius: number, color?: string) {
        super(mass, position, velocity);

        this.radius = radius;
        this.xProjected = 0;
        this.yProjected = 0;
        this.radiusProjected = 0;
        this.color = color
            ?? `rgb(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`;
    }

    render(context: CanvasRenderingContext2D, camera: Camera): void {
        const width = context.canvas.width;
        const height = context.canvas.height;

        context.beginPath();
        let isFirst = true;
        for (const previousPosition of this.previousPositions) {
            if (previousPosition.z <= camera.position.z) {
                continue;
            }
            const point = this.getProjection(width, height, camera, previousPosition);
            if (isFirst) {
                isFirst = false;
                context.moveTo(point.x, point.y);
            } else {
                context.lineTo(point.x, point.y);
            }
        }
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 0.5;
        context.stroke();

        this.project(width, height, camera);
        if (this.position.z <= camera.position.z) {
            return;
        }

        context.beginPath();
        context.arc(this.xProjected, this.yProjected, this.radiusProjected, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

    private project(width: number, height: number, camera: Camera): void {
        const PROJECTION_CENTER_X = width / 2 + camera.position.x;
        const PROJECTION_CENTER_Y = height / 2 + camera.position.y;

        const zProjected = (0.5 * width * Math.tan((Math.PI - camera.fov) / 2)) / (this.position.z - camera.position.z);
        this.xProjected = this.position.x * zProjected + PROJECTION_CENTER_X;
        this.yProjected = this.position.y * zProjected + PROJECTION_CENTER_Y;
        const x2 = (this.position.x + this.radius) * zProjected + PROJECTION_CENTER_X;
        this.radiusProjected = x2 - this.xProjected;
    }
}
