interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export default class Camera {
    position: Vector3D = {x: 0, y: 0, z: 0};
    // TODO: direction: Vector3D = {x: 0, y: 0, z: 1};
    fov: number;

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
