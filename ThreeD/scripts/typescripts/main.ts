import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from './Helper.js';

const canvas: HTMLCanvasElement = getHTMLCanvasElementById('canvas');
const context: CanvasRenderingContext2D = getCanvasRenderingContext2D(canvas);

window.addEventListener('load', () => {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.beginPath();
    context.moveTo(100, 100);
    context.lineTo(300, 300);
    context.closePath();
    context.stroke()
});
