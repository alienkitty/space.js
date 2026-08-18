export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

/**
 * A simplified color class based on the three.js `Color` class.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js | three.js `Color` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/math/Color.js | Source}
 */
export class Color {
    isColor: boolean;

    r: number;
    g: number;
    b: number;

    private hslA: HSL;
    private hslB: HSL;

    constructor(r?: Color | number | string, g?: number, b?: number);

    private hue2rgb(p: number, q: number, t: number): number;

    set(r?: Color | number | string, g?: number, b?: number): this;

    setScalar(scalar: number): this;

    setHex(hex: number): this;

    setRGB(r: number, g: number, b: number): this;

    setHSL(h: number, s: number, l: number): this;

    setStyle(style: string): this;

    clone(): Color;

    copy(color: Color): this;

    getHex(): number;

    getHexString(): string;

    getHSL(target: HSL): HSL;

    getRGB(target: RGB): RGB;

    offsetHSL(h: number, s: number, l: number): this;

    add(color: Color): this;

    addColors(color1: Color, color2: Color): this;

    addScalar(scalar: number): this;

    sub(color: Color): this;

    multiply(color: Color): this;

    multiplyScalar(scalar: number): this;

    lerp(color: Color, alpha: number): this;

    lerpColors(color1: Color, color2: Color, alpha: number): this;

    lerpHSL(color: Color, alpha: number): this;

    equals(color: Color): boolean;

    fromArray(array: number[], offset?: number): this;

    toArray(array?: number[], offset?: number): number[];

    random(): this;
}
