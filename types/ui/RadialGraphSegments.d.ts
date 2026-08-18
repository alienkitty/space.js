import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphLabel } from './GraphLabel.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface RadialGraphSegmentsOptions {
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
    segments: number[];
    ratio: number[];
    labels: (string | GraphLabel)[];
    markers: [number, string][];
    range: number;
    infoDistanceX: number;
    infoDistanceY: number;
    labelDistance: number;
    suffix: string;
    format: (value: number) => string;
    hoverLabels: boolean;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;
}

interface GraphPathData {
    pathData: string;
    length: number;
    lookup: Point[];
    lookupPrecision: number;
}

/**
 * Radial graph with segments.
 *
 * @example
 * const graph = new RadialGraphSegments({
 *     value: Array.from({ length: 10 }, () => Math.random()),
 *     precision: 2,
 *     lookupPrecision: 100, // per segment
 *     segments: [5, 5] // length of each segment (minimum length of 2)
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
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraphSegments.js | Source}
 */
export class RadialGraphSegments extends Interface {
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
    private segments: number[];
    private ratio: number[];
    private labels: (string | GraphLabel)[];
    private markers: [number, string][];
    private range: number;
    private infoDistanceX: number;
    private infoDistanceY: number;
    private labelDistance: number;
    private format: (value: number) => string;
    private hoverLabels: boolean;
    private noHover: boolean;
    private noMarker: boolean;
    private noMarkerDrag: boolean;
    private noGradient: boolean;

    private startTime: number;
    private frame: number;

    private middle: number;
    private radius: number;
    private distance: number;
    private segmentsRatio: number[];
    private rangeHeight: number[];
    private startAngle: number;
    private array: number[];
    private ghostArray: number[];
    private points: Point[];
    private graphs: GraphPathData[];
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
    private labelsAnimatedIn: boolean;
    private hoveredIn: boolean;
    private labelHoveredIn: boolean;
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
    private label?: Interface;

    constructor(options?: Partial<RadialGraphSegmentsOptions>);

    private init(): void;

    private initGraphs(): void;

    private calculateLookup(graph: GraphPathData): void;

    private getCurvePoint(graph: GraphPathData, mouseAngle: number, slice: number): Point;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private initLabels(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private getSegmentsRatio(ratio: number[]) : number[];

    private getRangeHeight(range: number[]): number[];

    private getTextOffset(mouseAngle: number, infoDistanceX: number): number;

    private getMarkerName(): string;

    private onPointerDown: (e: PointerEvent) => null;

    private onPointerMove: (e: PointerEvent) => null;

    private onPointerUp: (e: PointerEvent) => null;

    private onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => null;

    private onMarkerClick: (e: { target: GraphMarker }) => null;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setData(data: string[][]): void;

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

    hoverLabelIn(): void;

    hoverLabelOut(fast?: boolean): void;

    animateLabelsIn(): void;

    animateLabelsOut(): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
