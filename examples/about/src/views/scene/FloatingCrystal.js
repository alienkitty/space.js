import { Color, Mesh, MeshStandardMaterial, OctahedronGeometry } from 'three';

import { WorldController } from '../../controllers/world/WorldController.js';
import { PhysicsController } from '../../controllers/world/PhysicsController.js';
import { RenderGroup } from './RenderGroup.js';

export class FloatingCrystal extends RenderGroup {
    constructor() {
        super();

        this.position.y = 0.7;
        this.scale.set(0.5, 1, 0.5);
    }

    async initMesh() {
        const { physics } = WorldController;

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
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        this.add(mesh);

        physics.add(mesh, { autoSleep: false });

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
        if (PhysicsController.enabled) {
            return;
        }

        this.position.y = 0.7 + Math.sin(time) * 0.1;
        this.rotation.y += 0.01;

        super.update();
    };
}
