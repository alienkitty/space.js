import { Interface } from '../utils/Interface.js';

export interface ProgressCanvasOptions {
    size: number;
}

/**
 * Canvas circle progress.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/ProgressCanvas.js | Source}
 */
export class ProgressCanvas extends Interface {
    width: number;
    height: number;
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    progress: number;
    needsUpdate: boolean;

    context?: CanvasRenderingContext2D;

    constructor(options?: Partial<ProgressCanvasOptions>);

    initCanvas(): void;

    addListeners(): void;

    removeListeners(): void;

    onUpdate: () => void;

    onProgress: (e: { progress: number }) => void;

    onComplete: () => void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
