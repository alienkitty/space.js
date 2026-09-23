import type { Mesh } from 'three';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

import { MapPanel } from './MapPanel.js';

/**
 * Roughness map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/RoughnessMapPanel.js | Source}
 */
export class RoughnessMapPanel extends MapPanel {
    constructor(mesh: Mesh, ui: UI | Point3D);

    override initPanel(): void;
}
