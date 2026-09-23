import { Component } from '../utils/Component.js';

import type { Interface } from '../utils/Interface.js';

export interface SmoothOptions {
    root: Interface;
    container: Interface;
    lerpSpeed: number;
}

/**
 * A smooth scroll based on the `Smooth` class by Jesper Landberg.
 *
 * @see {@link https://gist.github.com/jesperlandberg/dd2cb6c6d7c928601b7f0229db818171 | `Smooth` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/extras/Smooth.js | Source}
 */
export class Smooth extends Component {
    private root: Interface;
    private container: Interface;
    private lerpSpeed: number;

    private position: number;
    private last: number;
    private delta: number;
    private direction: number;
    private progress: number;
    private height: number;

    constructor(options?: Partial<SmoothOptions>);

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
