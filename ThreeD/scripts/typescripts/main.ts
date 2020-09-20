import { getHTMLCanvasElementById, getCanvasRenderingContext2D } from './Helper.js';

const canvas: HTMLCanvasElement = getHTMLCanvasElementById('canvas');
const context: CanvasRenderingContext2D = getCanvasRenderingContext2D(canvas);

window.addEventListener('load', () => {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.beginPath();
    context.moveTo(100, 100);
    context.lineTo(500, 700);
    context.closePath();
    context.stroke()
});
