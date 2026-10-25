import { Texture } from 'three';

import type { Scene } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Scene environment map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/EnvironmentMapPanel.js | Source}
 */
export class EnvironmentMapPanel extends Panel {
    scene: Scene;

    lastValue: Texture | null;
    supported: boolean;
    initialized: boolean;

    constructor(scene: Scene);

    setSupported(texture: Texture): void;

    initPanel(): void;
}
