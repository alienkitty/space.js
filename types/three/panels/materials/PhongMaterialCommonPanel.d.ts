import type { Mesh, MeshPhongMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Phong material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhongMaterialCommonPanel.js | Source}
 */
export class PhongMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshPhongMaterial[];
    material: MeshPhongMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
