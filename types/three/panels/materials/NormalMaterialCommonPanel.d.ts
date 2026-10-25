import type { Mesh, MeshNormalMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Normal material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/NormalMaterialCommonPanel.js | Source}
 */
export class NormalMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshNormalMaterial[];
    material: MeshNormalMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
