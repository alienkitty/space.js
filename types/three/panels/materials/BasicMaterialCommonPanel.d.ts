import type { Mesh, MeshBasicMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Basic material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/BasicMaterialCommonPanel.js | Source}
 */
export class BasicMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshBasicMaterial[];
    private material: MeshBasicMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
