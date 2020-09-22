import { getHtmlElementByIdAndType, getCanvasRenderingContext2D } from './Helper.js';
import Camera from "./Camera.js";
export default class Scene {
    // TODO: objects: PhysicsObject[]
    constructor(canvasId) {
        this.canvas = getHtmlElementByIdAndType(canvasId, HTMLCanvasElement);
        this.context = getCanvasRenderingContext2D(this.canvas);
        this.camera = new Camera();
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    }
    resizeCanvas() {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    }
}
