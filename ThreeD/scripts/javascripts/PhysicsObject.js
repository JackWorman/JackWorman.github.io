export class PhysicsObject {
    // private mass: number;
    constructor(position, velocity, acceleration, jerk) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.jerk = jerk;
    }
    move(dt) {
        this.updateTriple(dt, this.position, this.velocity, this.acceleration, this.jerk);
        this.updateTriple(dt, this.velocity, this.acceleration, this.jerk, { x: 0, y: 0, z: 0 });
        this.updateTriple(dt, this.acceleration, this.jerk, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    }
    updateTriple(dt, t1, t2, t3, t4) {
        t1.x += t2.x * dt + t3.x * Math.pow(dt, 2) / 2 + t4.x * Math.pow(dt, 3) / 6;
        t1.y += t2.y * dt + t3.y * Math.pow(dt, 2) / 2 + t4.y * Math.pow(dt, 3) / 6;
        t1.z += t2.z * dt + t3.z * Math.pow(dt, 2) / 2 + t4.z * Math.pow(dt, 3) / 6;
    }
}
