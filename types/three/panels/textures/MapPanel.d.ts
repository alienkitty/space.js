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
    private mesh: Mesh;
    private ui: UI | Point3D;
    private key: string;
    private mapping: Mapping;
    private colorSpace: ColorSpace;

    private materials: Material[];
    private material: Material;

    private supported: boolean;
    private initialized: boolean;

    constructor(mesh: Mesh, ui: UI | Point3D, key: string, mapping?: Mapping, colorSpace?: ColorSpace);

    protected initPanel(): void;

    private initThumbnailPanel(index: number, panel: Panel, parent?: List): void;

    private updateThumbnail(index: number): void;

    private updateOptions(): void;
}
