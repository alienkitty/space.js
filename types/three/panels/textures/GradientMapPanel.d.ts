import type { Mesh } from 'three';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

import { MapPanel } from './MapPanel.js';

/**
 * Gradient map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/GradientMapPanel.js | Source}
 */
export class GradientMapPanel extends MapPanel {
    constructor(mesh: Mesh, ui: UI | Point3D);
}
