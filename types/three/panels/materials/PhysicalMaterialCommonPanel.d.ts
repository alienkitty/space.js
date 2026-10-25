import type { Mesh, MeshPhysicalMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Physical material common panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhysicalMaterialCommonPanel.js | Source}
 */
export class PhysicalMaterialCommonPanel extends Panel {
    mesh: Mesh;

    materials: MeshPhysicalMaterial[];
    material: MeshPhysicalMaterial;

    constructor(mesh: Mesh);

    initPanel(): void;
}
