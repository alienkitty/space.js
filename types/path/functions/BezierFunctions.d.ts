import type { Point } from '../SVGPathProperties.js';

/**
 * Bézier path functions by Roger Veciana i Rovira.
 *
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/bezier.ts | `Bezier` Source}
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/bezier-functions.ts | Functions Source}
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/bezier-values.ts | Values Source}
 * @see {@link https://github.com/rveciana/svg-path-properties | svg-path-properties}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/path/functions/BezierFunctions.js | Source}
 */

export function cubicPoint(xs: number, ys: number, t: number): Point;

export function cubicDerivative(xs: number, ys: number, t: number): Point;

export function getCubicArcLength(xs: number, ys: number, t: number): number;

export function quadraticPoint(xs: number, ys: number, t: number): Point;

export function getQuadraticArcLength(xs: number, ys: number, t: number): number;

export function quadraticDerivative(xs: number, ys: number, t: number): Point;

export function t2length(length: number, totalLength: number, func: (t: number) => number): number;
