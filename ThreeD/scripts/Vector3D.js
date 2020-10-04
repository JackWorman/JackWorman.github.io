export default class Vector3D {
    constructor(x, y, z) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }
    static scale(scale, vector) {
        return vector.copy().scale(scale);
    }
    add(vector3d) {
        this.x += vector3d.x;
        this.y += vector3d.y;
        this.z += vector3d.z;
        return this;
    }
    copy() {
        return new Vector3D(this.x, this.y, this.z);
    }
}
