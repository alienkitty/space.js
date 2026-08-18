import type { Mesh } from 'three';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

import { MapPanel } from './MapPanel.js';

/**
 * Matcap map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/MatcapMapPanel.js | Source}
 */
export class MatcapMapPanel extends MapPanel {
    constructor(mesh: Mesh, ui: UI | Point3D);
}
