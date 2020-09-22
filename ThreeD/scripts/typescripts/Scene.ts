import {getHtmlElementByIdAndType, getCanvasRenderingContext2D} from './Helper.js';
import Camera from "./Camera.js";

export default class Scene {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    camera: Camera
    // TODO: objects: PhysicsObject[]

    constructor(canvasId: string) {
        this.canvas = getHtmlElementByIdAndType(canvasId, HTMLCanvasElement);
        this.context = getCanvasRenderingContext2D(this.canvas);
        this.camera = new Camera();
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    }

    private resizeCanvas(): void {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    }
}