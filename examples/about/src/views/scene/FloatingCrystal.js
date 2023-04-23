import { Color, Mesh, MeshStandardMaterial, OctahedronGeometry } from 'three';

import { RenderGroup } from './RenderGroup.js';

export class FloatingCrystal extends RenderGroup {
    constructor() {
        super();

        this.position.y = 0.7;
    }

    async initMesh() {
        const geometry = new OctahedronGeometry();

        const material = new MeshStandardMaterial({
            name: 'Floating Crystal',
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.6,
            roughness: 0.7,
            envMapIntensity: 1,
            flatShading: true
        });

        const mesh = new Mesh(geometry, material);
        mesh.scale.set(0.5, 1, 0.5);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        this.mesh = mesh;
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        console.log('FloatingCrystal', type);
        // if (type === 'over') {
        // } else {
        // }
    };

    onClick = () => {
        console.log('FloatingCrystal', 'click');
        // open('https://alien.js.org/');
    };

    /**
     * Public methods
     */

    update = time => {
        this.mesh.position.y = Math.sin(time) * 0.1;
        this.mesh.rotation.y += 0.01;

        super.update();
    };
}
