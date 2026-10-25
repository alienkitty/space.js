import { Texture } from 'three';

import type { Color, Scene } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Background map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/BackgroundMapPanel.js | Source}
 */
export class BackgroundMapPanel extends Panel {
    scene: Scene;

    lastValue: Color | Texture | null;
    supported: boolean;
    initialized: boolean;

    constructor(scene: Scene);

    setSupported(texture: Texture): void;

    initPanel(): void;
}
