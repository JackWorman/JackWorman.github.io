import { getHtmlElementByIdAndType } from './Helper.js';
import PhysicsObject from './PhysicsObject.js';
import Dot from './Dot.js';
import Scene from "./Scene.js";
const fpsSpan = getHtmlElementByIdAndType('span-fps', HTMLSpanElement);
const frames = [];
const dots = [];
const scene = new Scene('canvas-scene');
window.addEventListener('load', () => {
    createObjects();
    window.requestAnimationFrame(loop);
});
let lastFrame = 0;
function loop() {
    window.requestAnimationFrame(loop);
    const now = performance.now();
    const dt = (now - lastFrame) / 1000;
    frames.push(1 / dt);
    if (frames.length > 100) {
        frames.shift();
    }
    const average = (array) => array.reduce((a, b) => a + b) / array.length;
    fpsSpan.textContent = 'FPS: ' + average(frames).toFixed(2);
    lastFrame = now;
    scene.context.clearRect(0, 0, scene.canvas.width, scene.canvas.height);
    for (const dot of dots) {
        dot.render(scene.context, scene.camera.position);
        dot.updateGravity(dots);
        dot.move(dt);
    }
}
function createObjects() {
    const physicsObject = new PhysicsObject(10 ** 17 / (Math.random() + 1), { x: -500, y: 0, z: 1000 }, { x: 0, y: 1200, z: 0 });
    dots.push(new Dot(physicsObject, 20));
    const physicsObject2 = new PhysicsObject(10 ** 17, { x: 500, y: 0, z: 1000 }, { x: 0, y: -1400, z: 0 });
    dots.push(new Dot(physicsObject2, 50));
    const physicsObject3 = new PhysicsObject(10 ** 17 * (Math.random() + 1), { x: 0, y: -500, z: 500 }, { x: -1000, y: 0, z: 0 });
    dots.push(new Dot(physicsObject3, 20));
    const physicsObject4 = new PhysicsObject(10 ** 0, { x: 0, y: 0, z: 0 }, { x: 800, y: 0, z: 0 });
    dots.push(new Dot(physicsObject4, 10));
    const physicsObject5 = new PhysicsObject(10 ** 19 * (Math.random() + 1.2), { x: 0, y: 0, z: 1000 }, { x: 0, y: 0, z: 0 });
    dots.push(new Dot(physicsObject5, 100, 'rgb(255, 255, 0)'));
}
