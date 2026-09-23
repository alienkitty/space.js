import type { Material, Mesh } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

export const MaterialOptions: Map<string, [Material, Panel]>;

export function getKeyByMaterial(materialOptions: Map<string, [Material, Panel]>, material: Material): string;

export interface MaterialsPanelOptions {
    materialOptions: Map<string, [Material, Panel]>
}

/**
 * Materials panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/MaterialsPanel.js | Source}
 */
export class MaterialsPanel extends Panel {
    private mesh: Mesh;
    private ui: UI | Point3D;
    private materialOptions: Map<string, [Material, Panel]>;

    private properties: string[];
    private lastPanel: Panel;

    constructor(mesh: Mesh, ui: UI | Point3D, options: Partial<MaterialsPanelOptions>);

    private initPanel(): void;
}
