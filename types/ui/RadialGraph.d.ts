import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface RadialGraphOptions {
    value: number[];
    ghost?: number[] | boolean;
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
    value: number[];
    ghost?: number[] | boolean;
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
    format: (value: number) => string;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;

    startTime: number;
    frame: number;

    middle: number;
    radius: number;
    distance: number;
    rangeHeight: number;
    startAngle: number;
    array: number[];
    ghostArray: number[];
    points: Point[];
    pathData: string;
    length: number;
    lookup: Point[];
    bounds: DOMRect | null;
    offset: Vector2;
    origin: Vector2;
    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    mouseAngle: number;
    lastHover: 'out' | 'over';
    lastCursor: string;
    items: GraphMarker[];
    mobileOffset: number;
    isDragging: boolean;
    isDraggingAway: boolean;
    animatedIn: boolean;
    hoveredIn: boolean;
    needsUpdate: boolean;
    graphNeedsUpdate: boolean;

    lineColors: {
        graph: string;
        bottom: string;
        handle: string;
    };

    colorRange: Color[];

    colorStep: number;
    color: Color;
    alpha: number;

    props: {
        alpha: number;
        yMultiplier: number;
        progress: number;
    };

    handleProps: {
        alpha: number;
    };

    info?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;

    constructor(options?: Partial<RadialGraphOptions>);

    init(): void;

    calculateLookup(): void;

    getCurvePoint(mouseAngle: number): Point;

    initCanvas(): void;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    addListeners(): void;

    removeListeners(): void;

    getRangeHeight(range: number): number;

    getTextOffset(mouseAngle: number, infoDistanceX: number): number;

    getMarkerName(): string;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => void;

    onMarkerClick: (e: { target: GraphMarker }) => void;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setHover(type: 'out' | 'over'): void;

    setCursor(cursor: string): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setSize(width: number, height: number): void;

    addMarker(data: [number, string], fast?: boolean): void;

    removeMarker(marker: GraphMarker): void;

    update(value?: number[] | number): void;

    drawGraph(): void;

    drawPath(h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(fast?: boolean): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
