export default class Camera {
    constructor(fov) {
        this.position = { x: 0, y: 0, z: 0 };
        this.fov = fov;
        this.addEvents();
    }
    addEvents() {
        window.addEventListener('wheel', (event) => {
            this.position.z += event.deltaY * -50;
        });
        window.addEventListener('mousemove', (mouseEvent) => {
            if (mouseEvent.buttons !== 0) {
                this.position.x += mouseEvent.movementX;
                this.position.y += mouseEvent.movementY;
            }
        });
    }
}
