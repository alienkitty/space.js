import type { Mesh, MeshToonMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Toon material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/ToonMaterialCommonPanel.js | Source}
 */
export class ToonMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshToonMaterial[];
    material: MeshToonMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
