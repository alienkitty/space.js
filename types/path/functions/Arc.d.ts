import type { Point, PointProperties } from '../SVGPathProperties.js';

/**
 * Arc path functions by Roger Veciana i Rovira.
 *
 * @see {@link https://github.com/rveciana/svg-path-properties/blob/main/src/arc.ts | `Arc` Source}
 * @see {@link https://github.com/rveciana/svg-path-properties | svg-path-properties}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/path/functions/Arc.js | Source}
 */
export class Arc {
    private x0: number;
    private y0: number;
    private rx: number;
    private ry: number;
    private xAxisRotate: number;
    private largeArcFlag: boolean;
    private sweepFlag: boolean;
    private x1: number;
    private y1: number;
    private length: number;

    constructor(
        x0: number,
        y0: number,
        rx: number,
        ry: number,
        xAxisRotate: number,
        largeArcFlag: boolean,
        sweepFlag: boolean,
        x1: number,
        y1: number
    );

    getTotalLength(): number;

    getPointAtLength(length: number): Point;

    getTangentAtLength(length: number): Point;

    getPropertiesAtLength(length: number): PointProperties;
}
