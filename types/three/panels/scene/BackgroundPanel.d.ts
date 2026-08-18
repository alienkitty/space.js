import type { Color, Scene, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';

import type { UI } from '../../../ui/UI.js';

/**
 * Background panel for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/scene/BackgroundPanel.js | Source}
 */
export class BackgroundPanel extends Panel {
    private scene: Scene;
    private ui: UI;

    private lastValue: Color | Texture | null;
    private lastInvert: boolean | null;

    constructor(scene: Scene, ui: UI);

    private initPanel(): void;

    setInvert(value: boolean): void;
}
