import { BoxGeometry, Color, MathUtils, Mesh, MeshStandardMaterial } from 'three';

import { RenderGroup } from './RenderGroup.js';

export class AbstractCube extends RenderGroup {
    constructor() {
        super();

        this.position.x = 2.5;
    }

    async initMesh() {
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
        mesh.rotation.x = MathUtils.degToRad(-45);
        mesh.rotation.z = MathUtils.degToRad(-45);
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        this.add(mesh);

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
        this.mesh.rotation.y -= 0.005;

        super.update();
    };
}
