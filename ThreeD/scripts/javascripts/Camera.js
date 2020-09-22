export default class Camera {
    // TODO: direction: Vector3D = {x: 0, y: 0, z: 1};
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
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
