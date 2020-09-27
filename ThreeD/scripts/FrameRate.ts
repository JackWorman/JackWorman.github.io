import {getAverageOfArray, getHtmlElementByIdAndType} from "./Helper.js";

export default class FrameRate {
    private readonly span: HTMLSpanElement;
    private readonly frames: number[] = [];
    private timeOfLastFrame: number = performance.now();

    constructor(spanId: string) {
        this.span = getHtmlElementByIdAndType(spanId, HTMLSpanElement);
    }

    getDtInSeconds(): number {
        const currentTime: number = performance.now();
        const dt: number = (currentTime - this.timeOfLastFrame) / 1000;
        this.timeOfLastFrame = currentTime;
        this.updateFrames(dt);
        this.updateSpan();
        return dt;
    }

    private updateFrames(dt: number): void {
        this.frames.push(1 / dt);
        if (this.frames.length > 100) {
            this.frames.shift();
        }
    }

    private updateSpan(): void {
        const averageFps = getAverageOfArray(this.frames).toFixed(2);
        this.span.textContent = `FPS: ${averageFps}`;
    }
}