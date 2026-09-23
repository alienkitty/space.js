import type { Point, PointProperties } from '../SVGPathProperties.js';

/**
 * Bézier path functions by Roger Veciana i Rovira.
 *
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/bezier.ts | `Bezier` Source}
 * @see {@link https://github.com/rveciana/svg-path-properties | svg-path-properties}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/path/functions/Bezier.js | Source}
 */
export class Bezier {
    private a: Point;
    private b: Point;
    private c: Point;
    private d: Point;
    private length: number;
    private getArcLength: (xs: number[], ys: number[], t: number) => number;
    private getPoint: (xs: number[], ys: number[], t: number) => Point;
    private getDerivative: (xs: number[], ys: number[], t: number) => Point;

    constructor(
        ax: number,
        ay: number,
        bx: number,
        by: number,
        cx: number,
        cy: number,
        dx?: number,
        dy?: number
    );

    private normalizeTangent(derivative: Point): Point;

    getTotalLength(): number;

    getPointAtLength(length: number): Point;

    getTangentAtLength(length: number): Point;

    getPropertiesAtLength(length: number): PointProperties;

    getC(): Point;

    getD(): Point;
}
