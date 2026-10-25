import { Color } from '../math/Color.js';
import { Interface } from '../utils/Interface.js';

import type { Point } from '../path/SVGPathProperties.js';
import type { Tween } from '../tween/Tween.js';

export interface PanelGraphOptions {
    name: string;
    height: number;
    resolution: number;
    precision: number;
    lookupPrecision: number;
    range: number;
    suffix: string;
    format: (value: number) => string;
    value: number[];
    ghost?: number[] | boolean;
    noText: boolean;
    noHover: boolean;
    noGradient: boolean;
    callback: (value: number[], target: PanelGraph) => void;
}

/**
 * A panel graph.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelGraph.js | Source}
 */
export class PanelGraph extends Interface {
    name: string;
    height: number;
    resolution: number;
    precision: number;
    lookupPrecision: number;
    range: number;
    format: (value: number) => string;
    value: number[];
    ghost?: number[] | boolean;
    noText: boolean;
    noHover: boolean;
    noGradient: boolean;
    callback: (value: number[], target: PanelGraph) => void;

    width: number;
    rangeHeight: number;
    array: number[];
    ghostArray: number[];
    pathData: string;
    length: number;
    lookup: Point[];
    bounds: DOMRect | null;
    mouseX: number;
    animatedIn: boolean;
    hoveredIn: boolean;
    needsUpdate: boolean;
    graphNeedsUpdate: boolean;

    lineColors: {
        graph: string,
        bottom: string,
        handle: string
    };

    colorRange: Color[];

    colorStep: number;
    color: Color;
    alpha: number;

    last: number;
    time: number;
    delta: number;
    count: number;
    prev: number;
    fps: number;

    refreshRate120: number;
    refreshRate240: number;

    handleProps: {
        alpha: number
    };

    timeout?: Tween;

    container?: Interface;
    content?: Interface;
    number?: Interface;
    info?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;
    strokeStyle?: CanvasGradient;
    fillStyle?: CanvasGradient;

    constructor(options: Partial<PanelGraphOptions>);

    init(): void;

    calculateLookup(): void;

    getCurveY(mouseX: number): number;

    initCanvas(): void;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    addListeners(): void;

    removeListeners(): void;

    getRangeHeight(range: number): number;

    onHover: (e: MouseEvent) => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => null;

    onUpdate: () => null;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setValue(value?: number): void;

    resize(): void;

    update(value?: number[] | number): void;

    drawGraph(): void;

    drawPath(h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
