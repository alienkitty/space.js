import type { Point, PointProperties } from '../SVGPathProperties.js';

/**
 * Linear path functions by Roger Veciana i Rovira.
 *
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/linear.ts | `LinearPosition` Source}
 * @see {@link https://github.com/rveciana/svg-path-properties | svg-path-properties}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/path/functions/Linear.js | Source}
 */
export class LinearPosition {
    private x0: number;
    private x1: number;
    private y0: number;
    private y1: number;

    constructor(x0: number, x1: number, y0: number, y1: number);

    getTotalLength(): number;

    getPointAtLength(length: number): Point;

    getTangentAtLength(length: number): Point;

    getPropertiesAtLength(length: number): PointProperties;
}
