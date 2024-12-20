import { BoxGeometry, Color, Group, MathUtils, Mesh, MeshStandardMaterial } from 'three';

import { WorldController } from '../../controllers/world/WorldController.js';
import { PhysicsController } from '../../controllers/world/PhysicsController.js';

import { layers } from '../../config/Config.js';

export class AbstractCube extends Group {
    constructor() {
        super();

        this.position.x = 2.5;
        this.rotation.x = MathUtils.degToRad(-45);
        this.rotation.z = MathUtils.degToRad(-45);
    }

    async initMesh() {
        const { physics } = WorldController;

        const geometry = new BoxGeometry();
        geometry.computeTangents();

        const material = new MeshStandardMaterial({
            name: 'Abstract Cube',
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.7,
            roughness: 0.7,
            flatShading: true
        });

        const mesh = new Mesh(geometry, material);
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        mesh.layers.enable(layers.buffers);
        this.add(mesh);

        // Physics
        physics.add(mesh, { density: 2, autoSleep: false });

        this.mesh = mesh;
    }

    // Event handlers

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

    // Public methods

    update = () => {
        if (PhysicsController.enabled) {
            return;
        }

        this.rotation.y -= 0.005;
    };

    ready = () => this.initMesh();
}
