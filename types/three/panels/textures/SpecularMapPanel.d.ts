import type { Mesh } from 'three';

import type { UI } from '../../../ui/UI.js';
import type { Point3D } from '../../ui/Point3D.js';

import { MapPanel } from './MapPanel.js';

/**
 * Specular map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/SpecularMapPanel.js | Source}
 */
export class SpecularMapPanel extends MapPanel {
    constructor(mesh: Mesh, ui: UI | Point3D);
}
