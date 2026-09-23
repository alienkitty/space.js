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
    ghost: number[];
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
    private name: string;
    private height: number;
    private resolution: number;
    private precision: number;
    private lookupPrecision: number;
    private range: number;
    private format: (value: number) => string;
    private value: number[];
    private ghost: number[];
    private noText: boolean;
    private noHover: boolean;
    private noGradient: boolean;
    private callback: (value: number[], target: PanelGraph) => void;

    private width: number;
    private rangeHeight: number;
    private array: number[];
    private ghostArray: number[];
    private pathData: string;
    private length: number;
    private lookup: Point[];
    private bounds: DOMRect | null;
    private mouseX: number;
    private animatedIn: boolean;
    private hoveredIn: boolean;
    private needsUpdate: boolean;
    private graphNeedsUpdate: boolean;

    private lineColors: {
        graph: string,
        bottom: string,
        handle: string
    };

    private colorRange: Color[];

    private colorStep: number;
    private color: Color;
    private alpha: number;

    private last: number;
    private time: number;
    private delta: number;
    private count: number;
    private prev: number;
    private fps: number;

    private refreshRate120: number;
    private refreshRate240: number;

    private handleProps: {
        alpha: number
    };

    private timeout?: Tween;

    private container?: Interface;
    private content?: Interface;
    private number?: Interface;
    private info?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;
    private strokeStyle?: CanvasGradient;
    private fillStyle?: CanvasGradient;

    constructor(options: Partial<PanelGraphOptions>);

    private init(): void;

    private calculateLookup(): void;

    private getCurveY(mouseX: number): number;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private addListeners(): void;

    private removeListeners(): void;

    private getRangeHeight(range: number): number;

    private onHover: (e: MouseEvent) => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => null;

    private onUpdate: () => null;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setValue(value?: number): void;

    resize(): void;

    update(value?: number | number[]): void;

    drawGraph(): void;

    drawPath(h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
