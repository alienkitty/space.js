import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import type { RadialGraphCanvas } from './RadialGraphCanvas.js';
import type { RadialGraphSegmentsCanvas } from './RadialGraphSegmentsCanvas.js';

export type RadialGraphCanvasInstance = RadialGraphCanvas | RadialGraphSegmentsCanvas;

export interface RadialGraphContainerCursorEvent {
    cursor: string;
    target: RadialGraphCanvasInstance;
}

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
    start: number;
    graphHeight: number;

    position: Vector2;
    objectWidth: number;
    objectHeight: number;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    middle: number;
    startAngle: number;

    index: number;
    graph: RadialGraphCanvasInstance | null;

    constructor(options?: Partial<RadialGraphContainerOptions>);

    init(): void;

    removeListeners(): void;

    onCursor: (e: { cursor: string, target: RadialGraphCanvasInstance }) => void;

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
