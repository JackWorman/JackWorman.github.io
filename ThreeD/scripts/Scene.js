import {getCanvasRenderingContext2D, getHtmlElementByIdAndType} from './Helper.js';
import Camera from "./Camera.js";

export default class Scene {
    constructor(canvasId) {
        this.physicsObjects = [];
        this.canvas = getHtmlElementByIdAndType(canvasId, HTMLCanvasElement);
        this.context = getCanvasRenderingContext2D(this.canvas);
        this.camera = new Camera(120 / 180 * Math.PI);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    resizeCanvas() {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    }
    addPhysicsObjects(physicsObjects) {
        this.physicsObjects.push(...physicsObjects);
        return this;
    }
}
