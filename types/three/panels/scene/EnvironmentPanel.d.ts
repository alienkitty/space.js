import type { Scene } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Environment panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/scene/EnvironmentPanel.js | Source}
 */
export class EnvironmentPanel extends Panel {
    private scene: Scene;

    constructor(scene: Scene);

    private initPanel(): void;
}
