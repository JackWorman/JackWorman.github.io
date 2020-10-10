import Vector3 from "./Vector3.js";

export default class Camera {
    readonly position: Vector3 = new Vector3();
    // TODO: direction: Vector3D = {x: 0, y: 0, z: 1};
    readonly fov: number;

    constructor(fov: number) {
        this.fov = fov;
        this.addEvents();
    }

    private addEvents(): void {
        addEventListener('wheel', (event: WheelEvent) => {
            this.position.z += event.deltaY * -50;
        });
        addEventListener('mousemove', (mouseEvent: MouseEvent) => {
            if (mouseEvent.buttons !== 0) {
                this.position.x += mouseEvent.movementX;
                this.position.y += mouseEvent.movementY;
            }
        });
    }
}
