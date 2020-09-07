export function getHTMLCanvasElementById(id) {
    const htmlCanvasElement = document.getElementById(id);
    if (htmlCanvasElement instanceof HTMLCanvasElement) {
        return htmlCanvasElement;
    }
    throw new Error('Could not get HTMLCanvasElement.');
}
export function getCanvasRenderingContext2D(htmlCanvasElement) {
    const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
    if (canvasRenderingContext2D instanceof CanvasRenderingContext2D) {
        return canvasRenderingContext2D;
    }
    throw new Error('Could not get CanvasRenderingContext2D.');
}
