import type { Mesh, MeshStandardMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Standard material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/StandardMaterialCommonPanel.js | Source}
 */
export class StandardMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshStandardMaterial[];
    private material: MeshStandardMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
