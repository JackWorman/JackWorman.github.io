import {getHtmlElementByIdAndType, getCanvasRenderingContext2D} from './Helper.js';
import Camera from "./Camera.js";
import PhysicsObject from "./PhysicsObject.js";

export default class Scene {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly camera: Camera
    readonly physicsObjects: PhysicsObject[] = [];

    constructor(canvasId: string) {
        this.canvas = getHtmlElementByIdAndType(canvasId, HTMLCanvasElement);
        this.context = getCanvasRenderingContext2D(this.canvas);
        this.camera = new Camera(120/180 * Math.PI);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private resizeCanvas(): void {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    }

    addPhysicsObjects(physicsObjects: PhysicsObject[]): this {
        this.physicsObjects.push(...physicsObjects);
        return this;
    }
}
