import Scene from "./Scene.js";
import Sphere from "./Sphere.js";
import Vector3D from "./Vector3D.js";
import FrameRate from "./FrameRate.js";
const frameRate = new FrameRate('span-fps');
const scene = new Scene('canvas-scene');
window.addEventListener('load', () => {
    scene.addPhysicsObjects(createPhysicsObjects());
    window.requestAnimationFrame(simulate);
});
function simulate() {
    window.requestAnimationFrame(simulate);
    const dt = frameRate.getDtInSeconds();
    scene.context.clearRect(0, 0, scene.canvas.width, scene.canvas.height);
    scene.physicsObjects.sort((a, b) => { return b.position.z - a.position.z; });
    for (const physicsObject of scene.physicsObjects) {
        physicsObject.render(scene.context, scene.camera);
        physicsObject.updateGravity(scene.physicsObjects);
        physicsObject.move(dt);
    }
}
function createPhysicsObjects() {
    const physicsObjects = [];
    physicsObjects.push(new Sphere(10 ** 17 / (Math.random() + 1), new Vector3D(-500, 0, 1000), new Vector3D(0, 1200, 0), 20));
    physicsObjects.push(new Sphere(10 ** 17, new Vector3D(500, 0, 1000), new Vector3D(0, -1400, 0), 50));
    physicsObjects.push(new Sphere(10 ** 17 * (Math.random() + 1), new Vector3D(0, -500, 500), new Vector3D(-1000, 0, 0), 20));
    physicsObjects.push(new Sphere(10 ** 0, new Vector3D(), new Vector3D(800, 0, 0), 10));
    physicsObjects.push(new Sphere(10 ** 19 * (Math.random() + 1.2), new Vector3D(0, 0, 1000), new Vector3D(0, 0, 0), 100, 'rgb(255,255,0)'));
    physicsObjects.push(new Sphere(10 ** 15 * (Math.random() + 1), new Vector3D(0, -1000, 2000), new Vector3D(500, 100, 0), 20));
    return physicsObjects;
}
