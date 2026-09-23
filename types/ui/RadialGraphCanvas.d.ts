import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface RadialGraphCanvasOptions {
    context: CanvasRenderingContext2D;
    value: number[];
    ghost: number[];
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
 * Radial graph with context passed in.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraphCanvas.js | Source}
 */
export class RadialGraphCanvas extends Interface {
    private context: CanvasRenderingContext2D;
    private value: number[];
    private ghost: number[];
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

    private position: Vector2;
    private objectWidth: number;
    private objectHeight: number;
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;
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
    private isResizing: boolean;
    private animatedIn: boolean;
    private hoveredIn: boolean;
    private graphNeedsUpdate: boolean;
    private initialized: boolean;
    private enabled: boolean;

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

    constructor(options?: Partial<RadialGraphCanvasOptions>);

    private init(): void;

    private calculateLookup(): void;

    private getCurvePoint(mouseAngle: number): Point;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private addListeners(): void;

    private removeListeners(): void;

    private getRangeHeight(range: number): number;

    private getTextOffset(mouseAngle: number, infoDistanceX: number): number;

    private getMarkerName(): string;

    private onPointerDown: (e: PointerEvent) => null;

    private onPointerMove: (e: PointerEvent) => null;

    private onPointerUp: () => null;

    private onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => void;

    private onMarkerClick: (e: { target: GraphMarker }) => void;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setHover(type: 'out' | 'over'): void;

    setCursor(cursor: string): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setContext(context: CanvasRenderingContext2D): void;

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
