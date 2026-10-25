import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { GraphLabel } from './GraphLabel.js';
import { GraphMarker } from './GraphMarker.js';

import type { Point } from '../path/SVGPathProperties.js';

export interface GraphPathData {
    pathData: string;
    length: number;
    lookup: Point[];
    lookupPrecision: number | number[];
}

export interface RadialGraphSegmentsCanvasOptions {
    context: CanvasRenderingContext2D;
    value: number[];
    ghost?: number[] | boolean;
    start: number;
    graphHeight: number;
    resolution: number;
    tension: number;
    precision: number;
    lookupPrecision: number | number[];
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

/**
 * Radial graph with segments and canvas context passed in.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraphSegmentsCanvas.js | Source}
 */
export class RadialGraphSegmentsCanvas extends Interface {
    context: CanvasRenderingContext2D;
    value: number[];
    ghost?: number[] | boolean;
    start: number;
    graphHeight: number;
    resolution: number;
    tension: number;
    precision: number;
    lookupPrecision: number | number[];
    segments: number[];
    ratio: number[];
    labels: (string | GraphLabel)[];
    markers: [number, string][];
    range: number;
    infoDistanceX: number;
    infoDistanceY: number;
    labelDistance: number;
    format: (value: number) => string;
    hoverLabels: boolean;
    noHover: boolean;
    noMarker: boolean;
    noMarkerDrag: boolean;
    noGradient: boolean;

    position: Vector2;
    objectWidth: number;
    objectHeight: number;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    middle: number;
    radius: number;
    distance: number;
    segmentsRatio: number[];
    rangeHeight: number[];
    startAngle: number;
    array: number[];
    ghostArray: number[];
    points: Point[];
    graphs: GraphPathData[];
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
    isResizing: boolean;
    animatedIn: boolean;
    labelsAnimatedIn: boolean;
    hoveredIn: boolean;
    labelHoveredIn: boolean;
    graphNeedsUpdate: boolean;
    initialized: boolean;
    enabled: boolean;

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
    label?: Interface;

    constructor(options?: Partial<RadialGraphSegmentsCanvasOptions>);

    init(): void;

    initGraphs(): void;

    calculateLookup(graph: GraphPathData): void;

    getCurvePoint(graph: GraphPathData, mouseAngle: number, slice: number): Point;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    initLabels(): void;

    addListeners(): void;

    removeListeners(): void;

    getSegmentsRatio(ratio: number[]) : number[];

    getRangeHeight(range: number[]): number[];

    getTextOffset(mouseAngle: number, infoDistanceX: number): number;

    getMarkerName(): string;

    onPointerDown: (e: PointerEvent) => null;

    onPointerMove: (e: PointerEvent) => null;

    onPointerUp: (e: PointerEvent) => null;

    onMarkerUpdate: (e: { dragging: boolean, target: GraphMarker }) => null;

    onMarkerClick: (e: { target: GraphMarker }) => null;

    setMarkers(markers: [number, string][], fast?: boolean): void;

    setData(data: number[][]): void;

    setHover(type: 'out' | 'over'): void;

    setCursor(cursor: string): void;

    setRange(range: number): void;

    setArray(value?: number[]): void;

    setGhostArray(value?: number[]): void;

    setContext(context: CanvasRenderingContext2D): void;

    setSize(width: number, height: number): void;

    addMarker(data: [number, string], fast?: boolean): void;

    removeMarker(marker: GraphMarker): void;

    update(value?: number[] | number): void;

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
