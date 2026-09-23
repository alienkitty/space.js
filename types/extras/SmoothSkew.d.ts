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
    private root: Interface;
    private container: Interface;
    private lerpSpeed: number;
    private skew: number;

    private position: number;
    private last: number;
    private delta: number;
    private direction: number;
    private progress: number;
    private height: number;

    constructor(options?: Partial<SmoothSkewOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onResize: () => Promise<void>;

    private onUpdate: () => void;

    setScroll(top: number): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
