/**
 * A simplified 2D vector class based on the three.js `Vector2` class.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/math/Vector2.js | three.js `Vector2` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/math/Vector2.js | Source}
 */
export class Vector2 {
    isVector2: boolean;

    x: number;
    y: number;

    constructor(x?: number, y?: number);

    set(x: number, y: number): this;

    setScalar(scalar: number): this;

    setX(x: number): this;

    setY(y: number): this;

    clone(): Vector2;

    copy(v: Vector2): this;

    add(v: Vector2): this;

    addScalar(scalar: number): this;

    addVectors(a: Vector2, b: Vector2): this;

    addScaledVector(v: Vector2, scalar: number): this;

    sub(v: Vector2): this;

    subScalar(scalar: number): this;

    subVectors(a: Vector2, b: Vector2): this;

    multiply(v: Vector2): this;

    multiplyScalar(scalar: number): this;

    divide(v: Vector2): this;

    divideScalar(scalar: number): this;

    min(v: Vector2): this;

    max(v: Vector2): this;

    clamp(min: Vector2, max: Vector2): this;

    clampScalar(minVal: number, maxVal: number): this;

    clampLength(min: number, max: number): this;

    floor(): this;

    ceil(): this;

    round(): this;

    roundToZero(): this;

    negate(): this;

    dot(v: Vector2): number;

    cross(v: Vector2): number;

    lengthSq(): number;

    length(): number;

    manhattanLength(): number;

    normalize(): this;

    angle(): number;

    angleTo(v: Vector2): number;

    distanceTo(v: Vector2): number;

    distanceToSquared(v: Vector2): number;

    manhattanDistanceTo(v: Vector2): number;

    setLength(length: number): this;

    lerp(v: Vector2, alpha: number): this;

    lerpVectors(v1: Vector2, v2: Vector2, alpha: number): this;

    equals(v: Vector2): boolean;

    fromArray(array: number[], offset?: number): this;

    toArray(array?: number[], offset?: number): number[];

    rotateAround(center: Vector2, angle: number): this;

    random(): this;
}
