import { Texture } from 'three';

import type { Color, Scene } from 'three';

import { Panel } from '../../../panels/Panel.js';

/**
 * Background map panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/BackgroundMapPanel.js | Source}
 */
export class BackgroundMapPanel extends Panel {
    private scene: Scene;

    private lastValue: Color | Texture | null;
    private supported: boolean;
    private initialized: boolean;

    constructor(scene: Scene);

    private setSupported(texture: Texture): void;

    private initPanel(): void;
}
