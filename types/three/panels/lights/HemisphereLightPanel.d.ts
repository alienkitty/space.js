import type { HemisphereLight } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Hemisphere light panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/HemisphereLightPanel.js | Source}
 */
export class HemisphereLightPanel extends Panel {
    private panel: Panel;
    private light: HemisphereLight;

    constructor(panel: Panel, light: HemisphereLight);

    private initPanel(): void;
}
