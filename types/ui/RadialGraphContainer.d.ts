import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import type { RadialGraphCanvas } from './RadialGraphCanvas.js';
import type { RadialGraphSegmentsCanvas } from './RadialGraphSegmentsCanvas.js';

export type RadialGraphCanvasInstance = RadialGraphCanvas | RadialGraphSegmentsCanvas;

export interface RadialGraphContainerOptions {
    start: number;
    graphHeight: number;
}

/**
 * Radial graph container for multiple graphs.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraphContainer.js | Source}
 */
export class RadialGraphContainer extends Interface {
    private start: number;
    private graphHeight: number;

    private position: Vector2;
    private objectWidth: number;
    private objectHeight: number;
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;
    private middle: number;
    private startAngle: number;

    private index: number;
    private graph: RadialGraphCanvasInstance | null;

    constructor(options?: Partial<RadialGraphContainerOptions>);

    private init(): void;

    private removeListeners(): void;

    private onCursor: (e: { cursor: string, target: RadialGraphCanvasInstance }) => void;

    onPointerUp: () => void;

    add(graph: RadialGraphCanvasInstance): RadialGraphCanvasInstance;

    setArray(value?: number[], index?: number): void;

    setGhostArray(value?: number[], index?: number): void;

    setContext(context: CanvasRenderingContext2D): void;

    setSize(width: number, height: number): void;

    setIndex(index: number): void;

    update(): void;

    animateLabelsIn(): void;

    animateLabelsOut(): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
