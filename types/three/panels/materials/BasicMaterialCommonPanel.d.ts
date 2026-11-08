import type { Mesh, MeshBasicMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Basic material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/BasicMaterialCommonPanel.js | Source}
 */
export class BasicMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshBasicMaterial[];
    material: MeshBasicMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
