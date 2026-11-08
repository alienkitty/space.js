import type { Mesh, MeshLambertMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Lambert material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/LambertMaterialCommonPanel.js | Source}
 */
export class LambertMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshLambertMaterial[];
    material: MeshLambertMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
