import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface GraphOptions {
    value: number[];
    ghost?: number[] | boolean;
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
    value: number[];
    ghost?: number[] | boolean;
    width: number;
    height: number;
    resolution: number;
    precision: number;
    lookupPrecision: number;
    markers: [number, string][];
    range: number;
    format: (value: number) => string;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;

    startTime: number;
    frame: number;

    rangeHeight: number;
    array: number[];
    ghostArray: number[];
    pathData: string;
    length: number;
    lookup: Point[];
    bounds: DOMRect | null;
    origin: Vector2;
    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    mouseX: number;
    items: GraphMarker[];
    mobileOffset: number;
    isDragging: boolean;
    isDraggingAway: boolean;
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

    props: {
        alpha: number,
        yMultiplier: number,
        progress: number
    };

    handleProps: {
        alpha: number
    };

    info?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;

    constructor(options?: Partial<GraphOptions>);

    init(): void;

    calculateLookup(): void;

    getCurveY(mouseX: number): number;

    initCanvas(): void;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    addListeners(): void;

    removeListeners(): void;

    getRangeHeight(range: number): number;

    getMarkerName(): string;

    onHover: (e: MouseEvent) => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => void;

    onMarkerClick: (e: { target: GraphMarker }) => void;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setSize(width: number, height: number): void;

    addMarker(data: [number, string], fast?: boolean): void;

    removeMarker(marker: GraphMarker): void;

    update(value?: number[] | number): void;

    drawGraph(): void;

    drawPath(w: number, h: number, array: number[], ghost?: boolean): void;

    hoverIn(): void;

    hoverOut(fast?: boolean): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
