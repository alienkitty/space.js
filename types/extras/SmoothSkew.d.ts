import { Component } from '../utils/Component.js';

import type { Interface } from '../utils/Interface.js';

export interface SmoothSkewOptions {
    root: Interface;
    container: Interface;
    lerpSpeed: number;
    skew: number;
}

/**
 * A smooth scroll with skew effect based on the `Smooth` class by Jesper Landberg.
 *
 * @see {@link https://codepen.io/ReGGae/pen/pxMJLW | `Smooth` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/extras/SmoothSkew.js | Source}
 */
export class SmoothSkew extends Component {
    root: Interface;
    container: Interface;
    lerpSpeed: number;
    skew: number;

    position: number;
    last: number;
    delta: number;
    direction: number;
    progress: number;
    height: number;

    constructor(options?: Partial<SmoothSkewOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onResize: () => Promise<void>;

    onUpdate: () => void;

    setScroll(top: number): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
