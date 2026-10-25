import { Interface } from '../utils/Interface.js';

export interface ProgressOptions {
    size: number;
}

/**
 * SVG circle progress.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Progress.js | Source}
 */
export class Progress extends Interface {
    width: number;
    height: number;
    x: number;
    y: number;
    radius: number;
    startOffset: number;
    progress: number;
    needsUpdate: boolean;

    circle?: Interface;

    constructor(options?: Partial<ProgressOptions>);

    initSVG(): void;

    addListeners(): void;

    removeListeners(): void;

    onUpdate: () => void;

    onProgress: (e: { progress: number }) => void;

    onComplete: () => void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
