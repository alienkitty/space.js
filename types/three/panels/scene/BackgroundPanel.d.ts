import type { Color, Scene, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';

/**
 * Background panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/scene/BackgroundPanel.js | Source}
 */
export class BackgroundPanel extends Panel {
    scene: Scene;
    ui: UI;

    lastValue: Color | Texture | null;
    lastInvert: boolean | null;

    constructor(scene: Scene, ui: UI);

    initPanel(): void;

    setInvert(value: boolean): void;
}
