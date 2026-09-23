import type { Mesh, MeshLambertMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Lambert material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/LambertMaterialCommonPanel.js | Source}
 */
export class LambertMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshLambertMaterial[];
    private material: MeshLambertMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
