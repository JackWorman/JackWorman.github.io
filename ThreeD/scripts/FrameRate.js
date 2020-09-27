import { getAverageOfArray, getHtmlElementByIdAndType } from "./Helper.js";
export default class FrameRate {
    constructor(spanId) {
        this.frames = [];
        this.timeOfLastFrame = performance.now();
        this.span = getHtmlElementByIdAndType(spanId, HTMLSpanElement);
    }
    getDtInSeconds() {
        const currentTime = performance.now();
        const dt = (currentTime - this.timeOfLastFrame) / 1000;
        this.timeOfLastFrame = currentTime;
        this.updateFrames(dt);
        this.updateSpan();
        return dt;
    }
    updateFrames(dt) {
        this.frames.push(1 / dt);
        if (this.frames.length > 100) {
            this.frames.shift();
        }
    }
    updateSpan() {
        const averageFps = getAverageOfArray(this.frames).toFixed(2);
        this.span.textContent = `FPS: ${averageFps}`;
    }
}
