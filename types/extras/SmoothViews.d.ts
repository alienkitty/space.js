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
    views: SmoothView[];
    root: Interface;
    container: Interface;
    sections: Interface[];
    lerpSpeed: number;

    position: number;
    last: number;
    delta: number;
    direction: number;
    index1: number;
    index2: number;
    progress: number;
    total: number;
    height: number;

    constructor(options?: Partial<SmoothViewsOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onResize: () => Promise<void>;

    onUpdate: () => void;

    setScroll(index: number): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
