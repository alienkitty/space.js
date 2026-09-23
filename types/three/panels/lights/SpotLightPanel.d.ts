import type { SpotLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Spot light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/SpotLightPanel.js | Source}
 */
export class SpotLightPanel extends Panel {
    private panel: Panel;
    private light: SpotLight;

    constructor(panel: Panel, light: SpotLight);

    private initPanel(): void;
}
