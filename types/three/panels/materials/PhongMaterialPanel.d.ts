import type { Mesh } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

export const PhongMaterialOptions: Map<string, Panel>;

/**
 * Phong material panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/materials/PhongMaterialPanel.js | Source}
 */
export class PhongMaterialPanel extends Panel {
    static readonly type = 'Phong';

    static properties: string[];

    private mesh: Mesh;
    private ui: UI | Point3D;

    constructor(mesh: Mesh, ui: UI | Point3D);

    private initPanel(): void;
}
