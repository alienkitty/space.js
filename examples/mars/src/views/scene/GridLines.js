import { Group } from 'three';
import { TwoPI } from '@alienkitty/space.js/three';
import { Polyline, PolylineMaterial } from '@alienkitty/alien.js/three';

import { WorldController } from '../../controllers/world/WorldController.js';

import { layers } from '../../config/Config.js';

export class GridLines extends Group {
    constructor(radius = 1, segments = 64) {
        super();

        this.radius = radius;
        this.segments = segments;

        this.visible = false;

        this.initLines();
    }

    initLines() {
        const { resolution/* , dpr */ } = WorldController;

        const material = new PolylineMaterial({
            color: 0x4da6ff,
            lineWidth: 1
        });
        material.depthWrite = false;
        material.uniforms.uResolution = resolution;
        // material.uniforms.uDPR = dpr;
        material.uniforms.uDPR.value = 2; // Always 2

        // Equator
        const positions = [];

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            positions.push(this.radius * Math.cos(angle), 0, this.radius * Math.sin(angle));
        }

        this.add(new Polyline({ positions, material }));

        // Prime meridian
        positions.length = 0;

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            positions.push(0, this.radius * Math.cos(angle), this.radius * Math.sin(angle));
        }

        this.add(new Polyline({ positions, material }));

        // 90th meridian
        positions.length = 0;

        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * TwoPI;
            positions.push(this.radius * Math.cos(angle), this.radius * Math.sin(angle), 0);
        }

        this.add(new Polyline({ positions, material }));

        this.children.forEach(object => {
            object.layers.set(layers.lines);
        });

        // Cleanup
        positions.length = 0;
    }
}
