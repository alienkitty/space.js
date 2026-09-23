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
    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private radius: number;
    private startAngle: number;
    private progress: number;
    private needsUpdate: boolean;

    private context?: CanvasRenderingContext2D;

    constructor(options?: Partial<ProgressCanvasOptions>);

    private initCanvas(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onUpdate: () => void;

    onProgress: (e: { progress: number }) => void;

    onComplete: () => void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
