import { Color, MathUtils, Mesh, MeshStandardMaterial } from 'three';

import { getSphericalCube } from '@alienkitty/space.js/three';

import { RenderGroup } from '../../objects/RenderGroup.js';

export class DarkPlanet extends RenderGroup {
    constructor() {
        super();

        this.position.x = -2.5;

        // 25 degree tilt like Mars
        this.rotation.z = MathUtils.degToRad(25);
    }

    async initMesh() {
        const geometry = getSphericalCube(0.6, 10);

        const material = new MeshStandardMaterial({
            name: 'Dark Planet',
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.6,
            roughness: 2,
            envMapIntensity: 1
        });

        const mesh = new Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        this.mesh = mesh;
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        console.log('DarkPlanet', type);
        // if (type === 'over') {
        // } else {
        // }
    };

    onClick = () => {
        console.log('DarkPlanet', 'click');
        // open('https://alien.js.org/');
    };

    /**
     * Public methods
     */

    update = () => {
        // Counter clockwise rotation
        this.mesh.rotation.y += 0.005;

        super.update();
    };
}
