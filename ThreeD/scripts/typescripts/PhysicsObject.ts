import Camera from "./Camera";

interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export default class PhysicsObject {
    readonly position: Vector3D;
    readonly velocity: Vector3D;
    readonly acceleration: Vector3D = {x: 0, y: 0, z: 0};
    readonly mass: number;

    constructor(mass: number, position?: Vector3D, velocity?: Vector3D) {
        this.mass = mass;
        this.position = typeof position !== 'undefined' ? position : {x: 0, y: 0, z: 0};
        this.velocity = typeof velocity !== 'undefined' ? velocity : {x: 0, y: 0, z: 0};
    }

    move(dt: number) {
        PhysicsObject.updateTriple(dt, this.position, this.velocity, this.acceleration);
        PhysicsObject.updateTriple(dt, this.velocity, this.acceleration, {x: 0, y: 0, z: 0});
        PhysicsObject.updateTriple(dt, this.acceleration, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
    }

    private static updateTriple(dt: number, t1: Vector3D, t2: Vector3D, t3: Vector3D) {
        t1.x += t2.x * dt + t3.x * dt ** 2 / 2;
        t1.y += t2.y * dt + t3.y * dt ** 2 / 2;
        t1.z += t2.z * dt + t3.z * dt ** 2 / 2;
    }

    updateGravity(dots: PhysicsObject[]) {
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.acceleration.z = 0;
        const G = 6.67408 * 10 ** -11;
        for (const pO of dots) {
            const rSquared = (this.position.x - pO.position.x) ** 2
                + (this.position.y - pO.position.y) ** 2
                + (this.position.z - pO.position.z) ** 2;
            if (rSquared === 0) {
                continue;
            }
            const a = G * pO.mass / rSquared;
            const diff: Vector3D = {x: 0, y: 0, z: 0};
            diff.x = pO.position.x - this.position.x;
            diff.y = pO.position.y - this.position.y;
            diff.z = pO.position.z - this.position.z;
            const scale = a / Math.sqrt(diff.x ** 2 + diff.y ** 2 + diff.z ** 2);
            this.acceleration.x += scale * diff.x;
            this.acceleration.y += scale * diff.y;
            this.acceleration.z += scale * diff.z;
        }
    }
}
