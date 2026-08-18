import type { Mesh, MeshPhysicalMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

/**
 * Physical material clearcoat panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhysicalMaterialClearcoatPanel.js | Source}
 */
export class PhysicalMaterialClearcoatPanel extends Panel {
    private mesh: Mesh;
    private ui: UI | Point3D;

    private materials: MeshPhysicalMaterial[];
    private material: MeshPhysicalMaterial;

    constructor(mesh: Mesh, ui: UI | Point3D);

    private initPanel(): void;
}
