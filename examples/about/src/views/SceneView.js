import { BoxGeometry, Color, Group, Mesh, MeshStandardMaterial } from 'three';

import { InputManager } from '../controllers/world/InputManager.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initMesh();
        this.initViews();
    }

    initMesh() {
        this.geometry = new BoxGeometry();

        this.material = new MeshStandardMaterial({
            name: 'Hello World',
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.6,
            roughness: 0.7,
            envMapIntensity: 1,
            flatShading: true
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    initViews() {
    }

    addListeners() {
        InputManager.add(this.mesh);
    }

    removeListeners() {
        InputManager.remove(this.mesh);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        console.log('onHover', type);
        // if (type === 'over') {
        // } else {
        // }
    };

    onClick = () => {
        console.log('onClick');
        // open('https://alien.js.org/');
    };

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.x -= 0.01;
        this.mesh.rotation.y -= 0.005;
    };

    animateIn = () => {
        this.addListeners();
    };

    ready = () => Promise.all([
    ]);
}
