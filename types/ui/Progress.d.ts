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
    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private radius: number;
    private startOffset: number;
    private progress: number;
    private needsUpdate: boolean;

    private circle?: Interface;

    constructor(options?: Partial<ProgressOptions>);

    private initSVG(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onUpdate: () => void;

    onProgress: (e: { progress: number }) => void;

    onComplete: () => void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
