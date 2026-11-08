import type { Material, Mesh } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

export const MaterialOptions: Map<string, [Material, typeof Panel]>;

export function getKeyByMaterial(materialOptions: Map<string, [Material, typeof Panel]>, material: Material): string;

export interface MaterialsPanelOptions {
    materialOptions: Map<string, [Material, typeof Panel]>
}

/**
 * Materials panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/MaterialsPanel.js | Source}
 */
export class MaterialsPanel extends Panel {
    mesh: Mesh;
    ui: UI | Point3D;
    materialOptions: Map<string, [Material, typeof Panel]>;

    properties: string[];
    lastPanel: typeof Panel;

    constructor(mesh: Mesh, ui?: UI | Point3D, options?: Partial<MaterialsPanelOptions>);

    initPanel(): void;
}
