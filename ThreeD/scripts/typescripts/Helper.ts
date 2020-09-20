export function getHTMLCanvasElementById(id: string): HTMLCanvasElement {
    const htmlCanvasElement = document.getElementById(id);
    if (htmlCanvasElement instanceof HTMLCanvasElement) {
        return htmlCanvasElement;
    }
    throw new Error('Could not get HTMLCanvasElement.');
}

export function getCanvasRenderingContext2D(htmlCanvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
    const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
    if (canvasRenderingContext2D instanceof CanvasRenderingContext2D) {
        return canvasRenderingContext2D;
    }
    throw new Error('Could not get CanvasRenderingContext2D.');
}

export function getHTMLButtonElementById(id: string): HTMLButtonElement {
    const htmlButtonElement = document.getElementById(id);
    if (htmlButtonElement instanceof HTMLButtonElement) {
        return htmlButtonElement;
    }
    throw new Error('Could not get HTMLButtonElement.');
}
