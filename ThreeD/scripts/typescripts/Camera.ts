import Vector3D from "./Vector3D.js";

export default class Camera {
    readonly position: Vector3D = new Vector3D();
    // TODO: direction: Vector3D = {x: 0, y: 0, z: 1};
    readonly fov: number;

    constructor(fov: number) {
        this.fov = fov;
        this.addEvents();
    }

    private addEvents(): void {
        window.addEventListener('wheel', (event: WheelEvent) => {
            this.position.z += event.deltaY * -50;
        });
        window.addEventListener('mousemove', (mouseEvent: MouseEvent) => {
            if (mouseEvent.buttons !== 0) {
                this.position.x += mouseEvent.movementX;
                this.position.y += mouseEvent.movementY;
            }
        });
    }
}
