import type { Mesh } from 'three';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

import { MapPanel } from './MapPanel.js';

/**
 * Metalness map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/MetalnessMapPanel.js | Source}
 */
export class MetalnessMapPanel extends MapPanel {
    constructor(mesh: Mesh, ui: UI | Point3D);

    override initPanel(): void;
}
