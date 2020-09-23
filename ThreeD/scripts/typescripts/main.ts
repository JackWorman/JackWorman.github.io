import PhysicsObject from './PhysicsObject.js';
import Sphere from './Sphere.js';
import Scene from "./Scene.js";
import FrameRate from "./FrameRate.js";
import Vector3D from "./Vector3D.js";

const scene: Scene = new Scene('canvas-scene');
const frameRate: FrameRate = new FrameRate('span-fps');
const physicsObjects: PhysicsObject[] = [];

window.addEventListener('load', () => {
    createObjects();
    window.requestAnimationFrame(simulate);
});

function simulate(): void {
    window.requestAnimationFrame(simulate);
    const dt = frameRate.getDtInSeconds();
    scene.context.clearRect(0, 0, scene.canvas.width, scene.canvas.height);
    for (const sphere of physicsObjects) {
        sphere.render(scene.context, scene.camera);
        sphere.updateGravity(physicsObjects);
        sphere.move(dt);
    }
}

function createObjects(): void {
    physicsObjects.push(new Sphere(
        10**17 / (Math.random() + 1),
        new Vector3D(-500, 0, 1000),
        new Vector3D(0, 1200, 0),
        20
    ));
    physicsObjects.push(new Sphere(
        10**17,
        new Vector3D(500, 0, 1000),
        new Vector3D(0, -1400, 0),
        50
    ));
    physicsObjects.push(new Sphere(
        10**17 * (Math.random() + 1),
        new Vector3D(0, -500, 500),
        new Vector3D(-1000, 0, 0),
        20
    ));
    physicsObjects.push(new Sphere(
        10**0,
        new Vector3D(),
        new Vector3D(800, 0, 0),
        10
    ));
    physicsObjects.push(new Sphere(
        10**19 * (Math.random() + 1.2),
        new Vector3D(0, 0, 1000),
        new Vector3D(),
        100,
        'rgb(255,255,0)'
    ));
}
