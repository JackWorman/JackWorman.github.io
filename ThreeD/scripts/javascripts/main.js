import { getHtmlElementByIdAndType, getCanvasRenderingContext2D } from './Helper.js';
import { PhysicsObject } from './PhysicsObject.js';
import { Dot } from './Dot.js';
const fpsSpan = getHtmlElementByIdAndType('span-fps', HTMLSpanElement);
const canvas = getHtmlElementByIdAndType('canvas-scene', HTMLCanvasElement);
const context = getCanvasRenderingContext2D(canvas);
const dots = [];
const frames = [];
window.addEventListener('load', () => {
    resizeCanvas();
    for (var i = 0; i < 1; i++) {
        // const pO = new PhysicsObject({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: Math.random() - 0.5, y: Math.random() - 0.5, z: (Math.random() - 0.5)});
        const pO = new PhysicsObject({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: Math.random() - 0.5, y: 0, z: 0 });
        const dot = new Dot(pO, 10);
        dots.push(dot);
    }
    window.setTimeout(() => window.requestAnimationFrame(render), 0);
});
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
}
let lastFrame = performance.now();
function render() {
    const now = performance.now();
    const dt = (now - lastFrame) / 1000;
    frames.push(1 / dt);
    if (frames.length > 100) {
        frames.shift();
    }
    const average = (array) => array.reduce((a, b) => a + b) / array.length;
    fpsSpan.textContent = 'FPS: ' + average(frames).toFixed(2);
    lastFrame = now;
    context.clearRect(0, 0, canvas.width, canvas.height);
    dots.sort((a, b) => b.position.z - a.position.z);
    for (const dot of dots) {
        dot.render(context);
        dot.move(dt);
    }
    window.setTimeout(() => window.requestAnimationFrame(render), 0);
}
