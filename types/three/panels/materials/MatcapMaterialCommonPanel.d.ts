import type { Mesh, MeshMatcapMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Matcap material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/MatcapMaterialCommonPanel.js | Source}
 */
export class MatcapMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshMatcapMaterial[];
    private material: MeshMatcapMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
