export default class Vector3 {
    private readonly elements: number[] = [];

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.elements = [x, y, z];
    }

    get x(): number {
        return this.elements[0];
    }

    set x(value: number) {
        this.elements[0] = value;
    }

    get y(): number {
        return this.elements[1];
    }

    set y(value: number) {
        this.elements[1] = value;
    }

    get z(): number {
        return this.elements[2];
    }

    set z(value: number) {
        this.elements[2] = value;
    }

    get magnitude(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.x + vector2.x,
            vector1.y + vector2.y,
            vector1.z + vector2.z
        );
    }

    static sub(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.x - vector2.x,
            vector1.y - vector2.y,
            vector1.z - vector2.z
        );
    }

    static scale(vector: Vector3, scale: number): Vector3 {
        return new Vector3(
            scale * vector.x,
            scale * vector.y,
            scale * vector.z,
        );
    }

    static clone(vector: Vector3): Vector3 {
        return new Vector3(...vector.elements);
    }

    static dot(vector1: Vector3, vector2: Vector3): number {
        return vector1.x * vector2.x
            + vector1.y * vector2.y
            + vector1.z * vector2.z;
    }

    static cross(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(
            vector1.y * vector2.z - vector1.z * vector2.y,
            vector1.z * vector2.x - vector1.x * vector2.z,
            vector1.x * vector2.y - vector1.y * vector2.x
        );
    }

    static distance(vector1: Vector3, vector2: Vector3): number {
        return Math.hypot(
            vector1.x - vector2.x,
            vector1.y - vector2.y,
            vector1.z - vector2.z
        );
    }

    static angle(vector1: Vector3, vector2: Vector3): number {
        return Math.acos(Vector3.dot(vector1, vector2) / (vector1.magnitude * vector2.magnitude));
    }

    set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    add(vector: Vector3): this {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    sub(vector: Vector3): this {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }

    scale(scale: number): this {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }

    normalize(): this {
        const magnitude = this.magnitude;
        if (magnitude === 0) {
            throw new Error('Cannot normalize a vector with a magnitude of 0.');
        }
        return this.scale(1 / magnitude);
    }
}