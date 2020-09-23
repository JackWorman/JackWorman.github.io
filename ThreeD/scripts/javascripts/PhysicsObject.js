import Vector3D from "./Vector3D.js";
export default class PhysicsObject {
    constructor(mass, position, velocity) {
        this.acceleration = new Vector3D();
        this.mass = mass;
        this.position = typeof position !== 'undefined' ? position : new Vector3D();
        this.velocity = typeof velocity !== 'undefined' ? velocity : new Vector3D();
    }
    move(dt) {
        PhysicsObject.updateTriple(dt, this.position, this.velocity, this.acceleration);
        PhysicsObject.updateTriple(dt, this.velocity, this.acceleration, new Vector3D());
        PhysicsObject.updateTriple(dt, this.acceleration, new Vector3D(), new Vector3D());
    }
    static updateTriple(dt, t1, t2, t3) {
        t1.x += t2.x * dt + t3.x * dt ** 2 / 2;
        t1.y += t2.y * dt + t3.y * dt ** 2 / 2;
        t1.z += t2.z * dt + t3.z * dt ** 2 / 2;
    }
    updateGravity(physicsObjects) {
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
            const diff = new Vector3D(physicsObject.position.x - this.position.x, physicsObject.position.y - this.position.y, physicsObject.position.z - this.position.z);
            const scale = a / Math.sqrt(diff.x ** 2 + diff.y ** 2 + diff.z ** 2);
            this.acceleration.add(diff.scale(scale));
        }
    }
}
