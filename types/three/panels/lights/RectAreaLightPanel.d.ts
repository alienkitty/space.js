import type { RectAreaLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * RectArea light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/RectAreaLightPanel.js | Source}
 */
export class RectAreaLightPanel extends Panel {
    private panel: Panel;
    private light: RectAreaLight;

    constructor(panel: Panel, light: RectAreaLight);

    private initPanel(): void;
}
