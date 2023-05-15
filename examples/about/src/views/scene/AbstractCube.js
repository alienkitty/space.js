import { BoxGeometry, Color, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three';

import { WorldController } from '../../controllers/world/WorldController.js';
import { PhysicsController } from '../../controllers/world/PhysicsController.js';
import { RenderGroup } from './RenderGroup.js';

export class AbstractCube extends RenderGroup {
    constructor() {
        super();

        this.position.x = 2.5;
        this.rotation.x = MathUtils.degToRad(-45);
        this.rotation.z = MathUtils.degToRad(-45);

        this.force = new Vector3();
        this.contact = false;
    }

    async initMesh() {
        const { physics } = WorldController;

        const geometry = new BoxGeometry();

        const material = new MeshStandardMaterial({
            name: 'Abstract Cube',
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
        console.log('AbstractCube', type);
        // if (type === 'over') {
        // } else {
        // }
    };

    onClick = () => {
        console.log('AbstractCube', 'click');
        // open('https://alien.js.org/');
    };

    /**
     * Public methods
     */

    update = () => {
        if (PhysicsController.enabled) {
            return;
        }

        this.rotation.y -= 0.005;

        super.update();
    };
}
