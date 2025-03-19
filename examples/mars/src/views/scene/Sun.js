import { Color, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three';

import { colors, layers } from '../../config/Config.js';

export class Sun extends Group {
    constructor() {
        super();

        this.position.z = -18050; // ~230 million km / 12,742 km (Earth's diameter)

        this.initMesh();
    }

    initMesh() {
        const geometry = new IcosahedronGeometry(109, 6); // 109 Earths

        const material = new MeshBasicMaterial({
            color: new Color(colors.lightColor).offsetHSL(0, 0, 0.25) // Increase brightness
        });

        const mesh = new Mesh(geometry, material);
        mesh.layers.set(layers.background);
        this.add(mesh);

        // Occlusion mesh
        const occMesh = mesh.clone();
        occMesh.material = new MeshBasicMaterial({
            color: new Color(colors.lightColor)
        });
        occMesh.layers.set(layers.occlusion);
        this.add(occMesh);

        this.occMesh = occMesh;
    }
}
