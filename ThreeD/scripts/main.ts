import Scene from "./Scene.js";
import PhysicsObject from "./PhysicsObject.js";
import Sphere from "./Sphere.js";
import FrameRate from "./FrameRate.js";
import Vector3 from "./Vector3.js";

const frameRate: FrameRate = new FrameRate('span-fps');
const scene: Scene = new Scene('canvas-scene');

window.addEventListener('load', () => {
    scene.addPhysicsObjects(createPhysicsObjects());
    window.requestAnimationFrame(simulate);
});

function simulate(): void {
    window.requestAnimationFrame(simulate);
    // const dt = frameRate.getDtInSeconds();
    frameRate.getDtInSeconds();
    const dt = 1 / 1000;
    scene.context.clearRect(0, 0, scene.canvas.width, scene.canvas.height);
    scene.physicsObjects.sort((a, b) => b.position.z - a.position.z);
    for (const physicsObject of scene.physicsObjects) {
        physicsObject.renderTrace(scene.context, scene.camera);
        physicsObject.render(scene.context, scene.camera);
        physicsObject.updateGravity(scene.physicsObjects);
        physicsObject.move(dt);
    }
}

function createPhysicsObjects(): PhysicsObject[] {
    const physicsObjects: PhysicsObject[] = [];
    physicsObjects.push(new Sphere(
        10 ** 17 / (Math.random() + 1),
        new Vector3(-500, 0, 1000),
        new Vector3(0, 1200, 0),
        20
    ));
    physicsObjects.push(new Sphere(
        10 ** 17,
        new Vector3(500, 0, 1000),
        new Vector3(0, -1400, 0),
        50
    ));
    physicsObjects.push(new Sphere(
        10 ** 17 * (Math.random() + 1),
        new Vector3(0, -500, 500),
        new Vector3(-1000, 0, 0),
        20
    ));
    physicsObjects.push(new Sphere(
        10 ** 0,
        new Vector3(100, 100, 100),
        new Vector3(800, 0, 0),
        10
    ));
    physicsObjects.push(new Sphere(
        10 ** 19 * (Math.random() + 1.2),
        new Vector3(0, 0, 1000),
        new Vector3(0, 0, 0),
        200,
        'rgb(255,255,0)'
    ));
    physicsObjects.push(new Sphere(
        10 ** 15 * (Math.random() + 1),
        new Vector3(0, -1000, 2000),
        new Vector3(500, 100, 0),
        20
    ));
    return physicsObjects;
}
