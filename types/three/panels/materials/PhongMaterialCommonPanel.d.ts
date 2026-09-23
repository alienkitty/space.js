import type { Mesh, MeshPhongMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Phong material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhongMaterialCommonPanel.js | Source}
 */
export class PhongMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshPhongMaterial[];
    private material: MeshPhongMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
