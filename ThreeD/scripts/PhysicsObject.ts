import Camera from "./Camera.js";
import Vector3 from "./Vector3.js";

const GRAVITATIONAL_CONSTANT = 6.67408 * 10 ** -11;

export default abstract class PhysicsObject {
    readonly position: Vector3;
    private readonly velocity: Vector3;
    private readonly acceleration: Vector3 = new Vector3();
    private readonly mass: number;
    private readonly previousPositions: Vector3[] = [];

    protected constructor(mass: number, position?: Vector3, velocity?: Vector3) {
        this.mass = mass;
        this.position = position ?? new Vector3();
        this.velocity = velocity ?? new Vector3();
    }

    abstract render(context: CanvasRenderingContext2D, camera: Camera): void;

    private static updateTriple(dt: number, t1: Vector3, t2: Vector3, t3: Vector3): void {
        t1
            .add(Vector3.scale(t2, dt))
            .add(Vector3.scale(t3, dt ** 2 / 2));
    }

    move(dt: number): void {
        PhysicsObject.updateTriple(dt, this.position, this.velocity, this.acceleration);
        PhysicsObject.updateTriple(dt, this.velocity, this.acceleration, new Vector3());
        PhysicsObject.updateTriple(dt, this.acceleration, new Vector3(), new Vector3());
        this.previousPositions.push(Vector3.clone(this.position));
        if (this.previousPositions.length > 500) {
            this.previousPositions.shift();
        }
    }

    updateGravity(physicsObjects: PhysicsObject[]): void {
        this.acceleration.set(0, 0, 0);
        for (const physicsObject of physicsObjects) {
            if (physicsObject === this) {
                continue;
            }
            const r: number = Vector3.distance(this.position, physicsObject.position);
            if (r === 0) {
                continue;
            }
            const a: number = GRAVITATIONAL_CONSTANT * physicsObject.mass / r ** 2;
            const diff: Vector3 = Vector3.sub(physicsObject.position, this.position);
            this.acceleration.add(diff.scale(a / r));
        }
    }

    renderTrace(context: CanvasRenderingContext2D, camera: Camera): void {
        const width = context.canvas.width;
        const height = context.canvas.height;

        context.beginPath();
        for (const previousPosition of this.previousPositions) {
            if (previousPosition.z <= camera.position.z) {
                continue;
            }
            const projPoint = this.getProjection(width, height, camera, previousPosition);
            context.lineTo(projPoint.x, projPoint.y);
        }
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 0.5;
        context.stroke();
    }

    protected getProjection(width: number, height: number, camera: Camera, vector: Vector3): Vector3 {
        const PROJECTION_CENTER_X = width / 2 + camera.position.x;
        const PROJECTION_CENTER_Y = height / 2 + camera.position.y;
        const zProjected = (0.5 * width * Math.tan((Math.PI - camera.fov) / 2)) / (vector.z - camera.position.z);
        const xProjected = vector.x * zProjected + PROJECTION_CENTER_X;
        const yProjected = vector.y * zProjected + PROJECTION_CENTER_Y;
        return new Vector3(xProjected, yProjected, zProjected);
    }
}
