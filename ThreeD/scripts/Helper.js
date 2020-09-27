export function getHtmlElementByIdAndType(id, htmlElementType) {
    const htmlElement = document.getElementById(id);
    if (htmlElement === null) {
        throw new Error(`No HTML element exists with id "${id}".`);
    }
    else if (!(htmlElement instanceof htmlElementType)) {
        throw new Error(`Found an HTML element with id "${id}", but it was not of type "${htmlElementType.name}".`);
    }
    return htmlElement;
}
export function getCanvasRenderingContext2D(htmlCanvasElement) {
    const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
    if (!(canvasRenderingContext2D instanceof CanvasRenderingContext2D)) {
        throw new Error('Could not get CanvasRenderingContext2D.');
    }
    return canvasRenderingContext2D;
}
export function getAverageOfArray(array) {
    return array.reduce((a, b) => a + b) / array.length;
}
