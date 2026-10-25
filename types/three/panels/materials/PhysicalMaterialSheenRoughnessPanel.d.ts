import type { Mesh, MeshPhysicalMaterial } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

/**
 * Physical material sheen roughness panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhysicalMaterialSheenRoughnessPanel.js | Source}
 */
export class PhysicalMaterialSheenRoughnessPanel extends Panel {
    mesh: Mesh;
    ui: UI | Point3D;

    materials: MeshPhysicalMaterial[];
    material: MeshPhysicalMaterial;

    constructor(mesh: Mesh, ui: UI | Point3D);

    initPanel(): void;
}
