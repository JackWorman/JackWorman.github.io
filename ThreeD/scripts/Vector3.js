export default class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.elements = [];
        this.elements = [x, y, z];
    }
    get x() {
        return this.elements[0];
    }
    set x(value) {
        this.elements[0] = value;
    }
    get y() {
        return this.elements[1];
    }
    set y(value) {
        this.elements[1] = value;
    }
    get z() {
        return this.elements[2];
    }
    set z(value) {
        this.elements[2] = value;
    }
    get magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
    static add(vector1, vector2) {
        return new Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }
    static sub(vector1, vector2) {
        return new Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
    }
    static scale(vector, scale) {
        return new Vector3(scale * vector.x, scale * vector.y, scale * vector.z);
    }
    static clone(vector) {
        return new Vector3(...vector.elements);
    }
    static dot(vector1, vector2) {
        return vector1.x * vector2.x
            + vector1.y * vector2.y
            + vector1.z * vector2.z;
    }
    static cross(vector1, vector2) {
        return new Vector3(vector1.y * vector2.z - vector1.z * vector2.y, vector1.z * vector2.x - vector1.x * vector2.z, vector1.x * vector2.y - vector1.y * vector2.x);
    }
    static distance(vector1, vector2) {
        return Math.hypot(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
    }
    static angle(vector1, vector2) {
        return Math.acos(Vector3.dot(vector1, vector2) / (vector1.magnitude * vector2.magnitude));
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }
    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude === 0) {
            throw new Error('Cannot normalize a vector with a magnitude of 0.');
        }
        return this.scale(1 / magnitude);
    }
}
