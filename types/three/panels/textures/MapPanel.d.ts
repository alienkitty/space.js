import type { ColorSpace, Mapping, Material, Mesh } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { List } from '../../../panels/List.js';
import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

/**
 * Texture map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/MapPanel.js | Source}
 */
export class MapPanel extends Panel {
    mesh: Mesh;
    ui: UI | Point3D;
    key: string;
    mapping: Mapping;
    colorSpace: ColorSpace;

    materials: Material[];
    material: Material;

    supported: boolean;
    initialized: boolean;

    constructor(mesh: Mesh, ui: UI | Point3D, key: string, mapping?: Mapping, colorSpace?: ColorSpace);

    protected initPanel(): void;

    initThumbnailPanel(index: number, panel: Panel, parent?: List): void;

    updateThumbnail(index: number): void;

    updateOptions(): void;
}
