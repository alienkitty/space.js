import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface RadialGraphOptions {
    value: number[];
    ghost: number[];
    width: number;
    height: number;
    start: number;
    graphHeight: number;
    resolution: number;
    tension: number;
    precision: number;
    lookupPrecision: number;
    markers: [number, string][];
    range: number;
    infoDistanceX: number;
    infoDistanceY: number;
    suffix: string;
    format: (value: number) => string;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;
}

/**
 * Radial graph.
 *
 * @example
 * const graph = new RadialGraph({
 *     value: Array.from({ length: 10 }, () => Math.random()),
 *     precision: 2,
 *     lookupPrecision: 200
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
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraph.js | Source}
 */
export class RadialGraph extends Interface {
    private value: number[];
    private ghost: number[];
    private width: number;
    private height: number;
    private start: number;
    private graphHeight: number;
    private resolution: number;
    private tension: number;
    private precision: number;
    private lookupPrecision: number;
    private markers: [number, string][];
    private range: number;
    private infoDistanceX: number;
    private infoDistanceY: number;
    private format: (value: number) => string;
    private noHover: boolean;
    private noMarker: boolean;
    private noMarkerDrag: boolean;
    private noGradient: boolean;

    private startTime: number;
    private frame: number;

    private middle: number;
    private radius: number;
    private distance: number;
    private rangeHeight: number;
    private startAngle: number;
    private array: number[];
    private ghostArray: number[];
    private points: Point[];
    private pathData: string;
    private length: number;
    private lookup: Point[];
    private bounds: DOMRect | null;
    private offset: Vector2;
    private origin: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private mouseAngle: number;
    private lastHover: 'out' | 'over';
    private lastCursor: string;
    private items: GraphMarker[];
    private mobileOffset: number;
    private isDragging: boolean;
    private isDraggingAway: boolean;
    private animatedIn: boolean;
    private hoveredIn: boolean;
    private needsUpdate: boolean;
    private graphNeedsUpdate: boolean;

    private lineColors: {
        graph: string;
        bottom: string;
        handle: string;
    };

    private colorRange: Color[];

    private colorStep: number;
    private color: Color;
    private alpha: number;

    private props: {
        alpha: number;
        yMultiplier: number;
        progress: number;
    };

    private handleProps: {
        alpha: number;
    };

    private info?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;

    constructor(options?: Partial<RadialGraphOptions>);

    private init(): void;

    private calculateLookup(): void;

    private getCurvePoint(mouseAngle: number): Point;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private addListeners(): void;

    private removeListeners(): void;

    private getRangeHeight(range: number): number;

    private getTextOffset(mouseAngle: number, infoDistanceX: number): number;

    private getMarkerName(): string;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    private onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => void;

    private onMarkerClick: (e: { target: GraphMarker }) => void;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setHover(type: 'out' | 'over'): void;

    setCursor(cursor: string): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setSize(width: number, height: number): void;

    addMarker(data: [number, string], fast?: boolean): void;

    removeMarker(marker: GraphMarker): void;

    update(value?: number | number[]): void;

    drawGraph(): void;

    drawPath(h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(fast?: boolean): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
