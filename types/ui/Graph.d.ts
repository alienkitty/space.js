import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface GraphOptions {
    value: number[];
    ghost: number[];
    width: number;
    height: number;
    resolution: number;
    precision: number;
    lookupPrecision: number;
    markers: [number, string][];
    range: number;
    suffix: string;
    format: (value: number) => string;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;
}

/**
 * Graph.
 *
 * @example
 * const graph = new Graph({
 *     value: Array.from({ length: 10 }, () => Math.random()),
 *     precision: 2,
 *     lookupPrecision: 100
 * });
 * graph.animateIn();
 * document.body.appendChild(graph.element);
 *
 * function animate() {
 *     requestAnimationFrame(animate);
 *
 *     graph.update();
 * }
 *
 * requestAnimationFrame(animate);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Graph.js | Source}
 */
export class Graph extends Interface {
    private value: number[];
    private ghost: number[];
    private width: number;
    private height: number;
    private resolution: number;
    private precision: number;
    private lookupPrecision: number;
    private markers: [number, string][];
    private range: number;
    private format: (value: number) => string;
    private noHover: boolean;
    private noMarker: boolean;
    private noMarkerDrag: boolean;
    private noGradient: boolean;

    private startTime: number;
    private frame: number;

    private rangeHeight: number;
    private array: number[];
    private ghostArray: number[];
    private pathData: string;
    private length: number;
    private lookup: Point[];
    private bounds: DOMRect | null;
    private origin: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private mouseX: number;
    private items: GraphMarker[];
    private mobileOffset: number;
    private isDragging: boolean;
    private isDraggingAway: boolean;
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

    private props: {
        alpha: number,
        yMultiplier: number,
        progress: number
    };

    private handleProps: {
        alpha: number
    };

    private info?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;

    constructor(options?: Partial<GraphOptions>);

    private init(): void;

    private calculateLookup(): void;

    private getCurveY(mouseX: number): number;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private addListeners(): void;

    private removeListeners(): void;

    private getRangeHeight(range: number): number;

    private getMarkerName(): string;

    private onHover: (e: MouseEvent) => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    private onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => void;

    private onMarkerClick: (e: { target: GraphMarker }) => void;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setSize(width: number, height: number): void;

    addMarker(data: [number, string], fast?: boolean): void;

    removeMarker(marker: GraphMarker): void;

    update(value?: number | number[]): void;

    drawGraph(): void;

    drawPath(w: number, h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(fast?: boolean): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
