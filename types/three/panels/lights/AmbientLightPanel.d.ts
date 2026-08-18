import type { AmbientLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Ambient light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/AmbientLightPanel.js | Source}
 */
export class AmbientLightPanel extends Panel {
    private panel: Panel;
    private light: AmbientLight;

    constructor(panel: Panel, light: AmbientLight);

    private initPanel(): void;
}
