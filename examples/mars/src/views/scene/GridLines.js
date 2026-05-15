import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from 'three';
import { TwoPI } from '@alienkitty/space.js/three';

export class GridLines extends Group {
    constructor(radius = 1, segments = 64) {
        super();

        this.radius = radius;
        this.segments = segments;

        this.visible = false;

        this.initLines();
    }

    initLines() {
        const gridMaterial = new LineBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.3
        });

        // Equator
        const points = [];

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            points.push(new Vector3(this.radius * Math.cos(angle), 0, this.radius * Math.sin(angle)));
        }

        this.add(new Line(new BufferGeometry().setFromPoints(points), gridMaterial));

        // Prime meridian
        points.length = 0;

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            points.push(new Vector3(0, this.radius * Math.cos(angle), this.radius * Math.sin(angle)));
        }

        this.add(new Line(new BufferGeometry().setFromPoints(points), gridMaterial));

        // 90th meridian
        points.length = 0;

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            points.push(new Vector3(this.radius * Math.cos(angle), this.radius * Math.sin(angle), 0));
        }

        this.add(new Line(new BufferGeometry().setFromPoints(points), gridMaterial));

        // Cleanup
        points.length = 0;
    }
}
