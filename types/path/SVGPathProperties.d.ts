// From https://github.com/rveciana/svg-path-properties

/**
 * Core interface for SVG path properties and calculations.
 * Provides methods to get length, points, and tangents along a path.
 */
export interface Properties {
    /**
     * Returns the total length of the path.
     * @returns The total path length in the same units as the path coordinates.
     */
    getTotalLength(): number;

    /**
     * Returns the point at a given length along the path.
     *
     * @param pos - The distance along the path (0 to total length).
     * @returns The x,y coordinates at the specified position.
     */
    getPointAtLength(pos: number): Point;

    /**
     * Returns the normalized tangent vector at a given length along the path.
     *
     * @param pos - The distance along the path (0 to total length).
     * @returns The normalized tangent vector at the specified position.
     */
    getTangentAtLength(pos: number): Point;

    /**
     * Returns both the point and tangent at a given length along the path.
     *
     * @param pos - The distance along the path (0 to total length).
     * @returns Combined point and tangent properties at the specified position.
     */
    getPropertiesAtLength(pos: number): PointProperties;
}

/**
 * Properties for a single part (segment) of an SVG path.
 * Each part represents one continuous path element (line, curve, arc, etc.).
 */
export interface PartProperties {
    /** The starting point of this path segment */
    start: Point;

    /** The ending point of this path segment */
    end: Point;

    /** The length of this path segment */
    length: number;

    /**
     * Returns the point at a given length along this segment.
     *
     * @param pos - The distance along the segment (0 to segment length).
     * @returns The x,y coordinates at the specified position.
     */
    getPointAtLength(pos: number): Point;

    /**
     * Returns the normalized tangent vector at a given length along this segment.
     *
     * @param pos - The distance along the segment (0 to segment length).
     * @returns The normalized tangent vector at the specified position.
     */
    getTangentAtLength(pos: number): Point;

    /**
     * Returns both the point and tangent at a given length along this segment.
     *
     * @param pos - The distance along the segment (0 to segment length).
     * @returns Combined point and tangent properties at the specified position.
     */
    getPropertiesAtLength(pos: number): PointProperties;
}

/**
 * Represents a 2D point with x and y coordinates.
 */
export interface Point {
    /** The x coordinate */
    x: number;

    /** The y coordinate */
    y: number;
}

/**
 * Array representation of a 2D point as [x, y].
 */
export type PointArray = [number, number];

/**
 * Combined point and tangent properties at a specific position on a path.
 * The tangent values represent the normalized direction vector at that point.
 */
export interface PointProperties {
    /** The x coordinate of the point */
    x: number;

    /** The y coordinate of the point */
    y: number;

    /** The x component of the normalized tangent vector */
    tangentX: number;

    /** The y component of the normalized tangent vector */
    tangentY: number;
}

/**
 * Valid SVG path command letters (lowercase).
 * - a: elliptical arc
 * - c: cubic bezier curve
 * - h: horizontal line
 * - l: line
 * - m: move to
 * - q: quadratic bezier curve
 * - s: smooth cubic bezier
 * - t: smooth quadratic bezier
 * - v: vertical line
 * - z: close path
 */
export type pathOrders = 'a' | 'c' | 'h' | 'l' | 'm' | 'q' | 's' | 't' | 'v' | 'z';

/**
 * A fast alternative to getPointAtLength(t) and getTotalLength() functions by Roger Veciana i Rovira.
 *
 * @see {@link https://github.com/rveciana/svg-path-properties | svg-path-properties}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/path/SVGPathProperties.js | Source}
 */
export class SVGPathProperties {
    private length: number;
    private partialLengths: number[];
    private functions: (Properties | null)[];
    private initialPoint: Point | null;

    constructor(path: string);

    getPartAtLength(length: number): void;

    getTotalLength(): number;

    getPointAtLength(length: number): Point;

    getTangentAtLength(length: number): Point;

    getPropertiesAtLength(length: number): PointProperties;

    getParts(): PartProperties[];
}
