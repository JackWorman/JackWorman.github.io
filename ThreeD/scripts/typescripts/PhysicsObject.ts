interface Triple {
    x: number;
    y: number;
    z: number;
}

export class PhysicsObject {
    position: Triple;
    velocity: Triple;
    acceleration: Triple;
    jerk: Triple;

    constructor(position: Triple, velocity: Triple, acceleration: Triple, jerk: Triple) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.jerk = jerk;
    }

    move(dt: number) {
        this.updateTriple(dt, this.position, this.velocity);
        this.updateTriple(dt, this.velocity, this.acceleration);
        this.updateTriple(dt, this.acceleration, this.jerk);
    }

    private updateTriple(dt: number, t1: Triple, t2: Triple) {
        t1.x += t2.x * dt;
        t1.y += t2.y * dt;
        t1.z += t2.z * dt;
    }
}
