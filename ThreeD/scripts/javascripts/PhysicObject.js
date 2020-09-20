export class PhysicsObject {
    constructor(position, velocity, acceleration, jerk) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.jerk = jerk;
    }
    move(dt) {
        this.updateTriple(dt, this.position, this.velocity);
        this.updateTriple(dt, this.velocity, this.acceleration);
        this.updateTriple(dt, this.acceleration, this.jerk);
    }
    updateTriple(dt, t1, t2) {
        t1.x += t2.x * dt;
        t1.y += t2.y * dt;
        t1.z += t2.z * dt;
    }
}
