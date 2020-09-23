import Camera from "./Camera.js";
import Vector3D from "./Vector3D.js";

export default abstract class PhysicsObject {
    readonly position: Vector3D;
    readonly velocity: Vector3D;
    readonly acceleration: Vector3D = new Vector3D();
    readonly mass: number;

    protected constructor(mass: number, position?: Vector3D, velocity?: Vector3D) {
        this.mass = mass;
        this.position = typeof position !== 'undefined' ? position : new Vector3D();
        this.velocity = typeof velocity !== 'undefined' ? velocity : new Vector3D();
    }

    abstract render(context: CanvasRenderingContext2D, camera: Camera): void;

    move(dt: number) {
        PhysicsObject.updateTriple(dt, this.position, this.velocity, this.acceleration);
        PhysicsObject.updateTriple(dt, this.velocity, this.acceleration, new Vector3D());
        PhysicsObject.updateTriple(dt, this.acceleration, new Vector3D(), new Vector3D());
    }

    private static updateTriple(dt: number, t1: Vector3D, t2: Vector3D, t3: Vector3D) {
        t1.x += t2.x * dt + t3.x * dt ** 2 / 2;
        t1.y += t2.y * dt + t3.y * dt ** 2 / 2;
        t1.z += t2.z * dt + t3.z * dt ** 2 / 2;
    }

    updateGravity(physicsObjects: PhysicsObject[]): void {
        this.acceleration.set(0, 0, 0);
        const G = 6.67408 * 10 ** -11;
        for (const physicsObject of physicsObjects) {
            const rSquared = (this.position.x - physicsObject.position.x) ** 2
                + (this.position.y - physicsObject.position.y) ** 2
                + (this.position.z - physicsObject.position.z) ** 2;
            if (rSquared === 0) {
                continue;
            }
            const a = G * physicsObject.mass / rSquared;
            const diff: Vector3D = new Vector3D(
                physicsObject.position.x - this.position.x,
                physicsObject.position.y - this.position.y,
                physicsObject.position.z - this.position.z
            );
            const scale = a / Math.sqrt(diff.x ** 2 + diff.y ** 2 + diff.z ** 2);
            this.acceleration.add(diff.scale(scale));
        }
    }
}
