interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export class PhysicsObject {
    position: Vector3D;
    velocity: Vector3D;
    acceleration: Vector3D;
    jerk: Vector3D;
    // private mass: number;

    constructor(position: Vector3D, velocity: Vector3D, acceleration: Vector3D, jerk: Vector3D) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.jerk = jerk;
    }

    move(dt: number) {
        this.updateTriple(dt, this.position, this.velocity, this.acceleration, this.jerk);
        this.updateTriple(dt, this.velocity, this.acceleration, this.jerk, {x: 0, y: 0, z: 0});
        this.updateTriple(dt, this.acceleration, this.jerk, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
    }

    private updateTriple(dt: number, t1: Vector3D, t2: Vector3D, t3: Vector3D, t4: Vector3D) {
        t1.x += t2.x * dt + t3.x * Math.pow(dt, 2) / 2 + t4.x * Math.pow(dt, 3) / 6;
        t1.y += t2.y * dt + t3.y * Math.pow(dt, 2) / 2 + t4.y * Math.pow(dt, 3) / 6;
        t1.z += t2.z * dt + t3.z * Math.pow(dt, 2) / 2 + t4.z * Math.pow(dt, 3) / 6;
    }
}
