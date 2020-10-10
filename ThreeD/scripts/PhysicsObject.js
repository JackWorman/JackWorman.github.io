import Vector3 from "./Vector3.js";

const GRAVITATIONAL_CONSTANT = 6.67408 * 10 ** -11;
export default class PhysicsObject {
    constructor(mass, position, velocity) {
        this.acceleration = new Vector3();
        this.previousPositions = [];
        this.mass = mass;
        this.position = position ?? new Vector3();
        this.velocity = velocity ?? new Vector3();
    }
    static updateTriple(dt, t1, t2, t3) {
        t1
            .add(Vector3.scale(t2, dt))
            .add(Vector3.scale(t3, dt ** 2 / 2));
    }
    move(dt) {
        PhysicsObject.updateTriple(dt, this.position, this.velocity, this.acceleration);
        PhysicsObject.updateTriple(dt, this.velocity, this.acceleration, new Vector3());
        PhysicsObject.updateTriple(dt, this.acceleration, new Vector3(), new Vector3());
        this.previousPositions.push(Vector3.clone(this.position));
        if (this.previousPositions.length > 500) {
            this.previousPositions.shift();
        }
    }
    updateGravity(physicsObjects) {
        this.acceleration.set(0, 0, 0);
        for (const physicsObject of physicsObjects) {
            if (physicsObject === this) {
                continue;
            }
            const r = Vector3.distance(this.position, physicsObject.position);
            if (r === 0) {
                continue;
            }
            const a = GRAVITATIONAL_CONSTANT * physicsObject.mass / r ** 2;
            const diff = Vector3.sub(physicsObject.position, this.position);
            this.acceleration.add(diff.scale(a / r));
        }
    }
    renderTrace(context, camera) {
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
    getProjection(width, height, camera, vector) {
        const PROJECTION_CENTER_X = width / 2 + camera.position.x;
        const PROJECTION_CENTER_Y = height / 2 + camera.position.y;
        const zProjected = (0.5 * width * Math.tan((Math.PI - camera.fov) / 2)) / (vector.z - camera.position.z);
        const xProjected = vector.x * zProjected + PROJECTION_CENTER_X;
        const yProjected = vector.y * zProjected + PROJECTION_CENTER_Y;
        return new Vector3(xProjected, yProjected, zProjected);
    }
}
