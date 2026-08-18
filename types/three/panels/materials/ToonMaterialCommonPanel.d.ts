import type { Mesh, MeshToonMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Toon material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/ToonMaterialCommonPanel.js | Source}
 */
export class ToonMaterialCommonPanel extends Panel {
    private mesh: Mesh;

    private materials: MeshToonMaterial[];
    private material: MeshToonMaterial;

    constructor(mesh: Mesh);

    private initPanel(): void;
}
