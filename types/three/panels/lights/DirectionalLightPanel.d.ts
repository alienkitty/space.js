import type { DirectionalLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Directional light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/DirectionalLightPanel.js | Source}
 */
export class DirectionalLightPanel extends Panel {
    private panel: Panel;
    private light: DirectionalLight;

    constructor(panel: Panel, light: DirectionalLight);

    private initPanel(): void;
}
