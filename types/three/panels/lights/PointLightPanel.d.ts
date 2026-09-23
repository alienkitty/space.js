import type { PointLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Point light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/PointLightPanel.js | Source}
 */
export class PointLightPanel extends Panel {
    private panel: Panel;
    private light: PointLight;

    constructor(panel: Panel, light: PointLight);

    private initPanel(): void;
}
