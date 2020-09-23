export default class Vector3D {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = typeof x !== 'undefined' ? x : 0;
        this.y = typeof y !== 'undefined' ? y : 0;
        this.z = typeof z !== 'undefined' ? z : 0;
    }

    set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    scale(scale: number): this {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }

    static scale(scale: number, vector: Vector3D) {
        return vector.copy().scale(scale);
    }

    add(vector3d: Vector3D): this {
        this.x += vector3d.x;
        this.y += vector3d.y;
        this.z += vector3d.z;
        return this;
    }

    copy(): Vector3D {
        return new Vector3D(this.x, this.y, this.z);
    }
}
