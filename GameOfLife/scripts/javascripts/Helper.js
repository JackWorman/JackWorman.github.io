"use strict";
exports.__esModule = true;
exports.getCanvasRenderingContext2D = exports.getHTMLCanvasElementById = void 0;
function getHTMLCanvasElementById(id) {
    var htmlCanvasElement = document.getElementById(id);
    if (htmlCanvasElement instanceof HTMLCanvasElement) {
        return htmlCanvasElement;
    }
    throw new Error('Could not get HTMLCanvasElement.');
}
exports.getHTMLCanvasElementById = getHTMLCanvasElementById;
function getCanvasRenderingContext2D(htmlCanvasElement) {
    var canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
    if (canvasRenderingContext2D instanceof CanvasRenderingContext2D) {
        return canvasRenderingContext2D;
    }
    throw new Error('Could not get CanvasRenderingContext2D.');
}
exports.getCanvasRenderingContext2D = getCanvasRenderingContext2D;
