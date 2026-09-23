import { Component } from '../utils/Component.js';

import type { Interface } from '../utils/Interface.js';

export interface SmoothView {
    top: number;
    height: number;
}

export interface SmoothViewsOptions {
    views: SmoothView[];
    root: Interface;
    container: Interface;
    sections: Interface[];
    lerpSpeed: number;
}

/**
 * A smooth scroll with progress between views.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/extras/SmoothViews.js | Source}
 */
export class SmoothViews extends Component {
    private views: SmoothView[];
    private root: Interface;
    private container: Interface;
    private sections: Interface[];
    private lerpSpeed: number;

    private position: number;
    private last: number;
    private delta: number;
    private direction: number;
    private index1: number;
    private index2: number;
    private progress: number;
    private total: number;
    private height: number;

    constructor(options?: Partial<SmoothViewsOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onResize: () => Promise<void>;

    private onUpdate: () => void;

    setScroll(index: number): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
