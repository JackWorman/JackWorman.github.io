import PhysicsObject from './PhysicsObject.js';
import Camera from "./Camera.js";
import Vector3 from "./Vector3.js";

interface Face {
    points: Vector3[]
    color: string
}

export default class Sphere extends PhysicsObject {
    private readonly radius: number;
    private readonly faces: Face[];

    constructor(mass: number, position: Vector3, velocity: Vector3, radius: number, color?: string) {
        super(mass, position, velocity);
        this.radius = radius;
        this.faces = this.createFaces();
    }

    render(context: CanvasRenderingContext2D, camera: Camera): void {
        const width = context.canvas.width;
        const height = context.canvas.height;

        if (this.position.z <= camera.position.z) {
            return;
        }

        this.faces.sort((a, b) => b.points[1].z - a.points[1].z);
        for (const face of this.faces) {
            context.beginPath();
            for (const point of face.points) {
                context.lineTo(...this.projectPoint(point, width, height, camera));
            }
            context.closePath();
            context.fillStyle = face.color;
            context.fill();
        }
    }

    private projectPoint(point: Vector3, width: number, height: number, camera: Camera): [number, number] {
        const newPoint = Vector3.add(point, this.position);
        const PROJECTION_CENTER_X = width / 2 + camera.position.x;
        const PROJECTION_CENTER_Y = height / 2 + camera.position.y;
        const zProjected = (0.5 * width * Math.tan((Math.PI - camera.fov) / 2)) / (newPoint.z - camera.position.z);
        const xProjected = (newPoint.x) * zProjected + PROJECTION_CENTER_X;
        const yProjected = (newPoint.y) * zProjected + PROJECTION_CENTER_Y;
        return [xProjected, yProjected];
    }

    private createFaces(): Face[] {
        const INC = 24;
        if (INC % 2 === 1) {
            throw new Error('INC must be even.');
        }
        const getRandomColor = () => `rgb(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())})`;
        const spherePoint = (thetaInc: number, phiInc: number) => {
            const theta = (thetaInc / INC) * 2 * Math.PI;
            const phi = (phiInc / INC) * 2 * Math.PI;
            return new Vector3(
                this.radius * Math.sin(theta) * Math.cos(phi),
                this.radius * Math.cos(theta),
                this.radius * Math.sin(theta) * Math.sin(phi)
            );
        }
        const faces: Face[] = [];
        for (let phi = 0; phi < INC; phi++) {
            const p1 = spherePoint(0, 0);
            const p2 = spherePoint(1, phi);
            const p3 = spherePoint(1, phi + 1);
            faces.push({
                points: [p1, p2, p3],
                color: getRandomColor()
            });
        }
        for (let theta = 1; theta < (INC / 2) - 1; theta++) {
            for (let phi = 0; phi < INC; phi++) {
                const p1 = spherePoint(theta, phi);
                const p2 = spherePoint(theta, phi + 1);
                const p3 = spherePoint(theta + 1, phi + 1);
                const p4 = spherePoint(theta + 1, phi);
                faces.push({
                    points: [p1, p2, p3, p4],
                    color: getRandomColor()
                });
            }
        }
        for (let phi = 0; phi < INC; phi++) {
            const p1 = spherePoint((INC / 2) - 1, phi);
            const p2 = spherePoint((INC / 2) - 1, phi + 1);
            const p3 = spherePoint((INC / 2), 0);
            faces.push({
                points: [p1, p2, p3],
                color: getRandomColor()
            });
        }
        return faces;
    }
}
