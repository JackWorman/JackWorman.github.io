import Vector3D from "./Vector3D.js";
export default class Camera {
    constructor(fov) {
        this.position = new Vector3D();
        this.fov = fov;
        this.addEvents();
    }
    addEvents() {
        addEventListener('wheel', (event) => {
            this.position.z += event.deltaY * -50;
        });
        addEventListener('mousemove', (mouseEvent) => {
            if (mouseEvent.buttons !== 0) {
                this.position.x += mouseEvent.movementX;
                this.position.y += mouseEvent.movementY;
            }
        });
    }
}
