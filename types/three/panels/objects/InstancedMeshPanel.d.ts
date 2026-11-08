import type { InstancedMesh } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { PanelItemData } from '../../../panels/PanelItem.js';
import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

/**
 * Instanced mesh panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/objects/InstancedMeshPanel.js | Source}
 */
export class InstancedMeshPanel extends Panel {
    mesh: InstancedMesh;
    ui: UI | Point3D;
    materialItems: PanelItemData;

    constructor(mesh: InstancedMesh, ui: UI | Point3D, materialItems: PanelItemData);

    initPanel(): void;
}
