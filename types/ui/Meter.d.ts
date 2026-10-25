import { Color } from '../math/Color.js';
import { Interface } from '../utils/Interface.js';

export interface MeterOptions {
    value: number;
    ghost: number | boolean;
    width: number;
    precision: number;
    range: number;
    suffix: string;
    format: (value: number) => string;
    noRange: boolean;
    noText: boolean;
    noGradient: boolean;
}

/**
 * Meter.
 *
 * @example
 * const meter = new Meter({
 *     value: Math.random(),
 *     precision: 2
 * });
 * meter.animateIn();
 * document.body.appendChild(meter.element);
 *
 * function animate() {
 *     requestAnimationFrame(animate);
 *
 *     meter.update();
 * }
 *
 * requestAnimationFrame(animate);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Meter.js | Source}
 */
export class Meter extends Interface {
    value: number;
    ghost: number | boolean;
    width: number;
    precision: number;
    range: number;
    format: (value: number) => string;
    noRange: boolean;
    noText: boolean;
    noGradient: boolean;

    startTime: number;
    frame: number;

    height: number;
    rangeWidth: number;
    animatedIn: boolean;
    needsUpdate: boolean;

    lineColors: {
        graph: string,
        bottom: string
    };

    colorRange: Color[];

    colorStep: number;
    color: Color;
    alpha: number;

    props: {
        xMultiplier: number;
        progress: number;
    };

    container?: Interface;
    number?: Interface;
    info?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;

    constructor(options?: Partial<MeterOptions>);

    init(): Promise<void>;

    initCanvas(): void;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    getRangeWidth(range: number): number;

    setRange(range: number): void;

    setValue(value?: number): void;

    setGhostValue(value?: number): void;

    setWidth(width: number): void;

    update(value?: number): void;

    drawGraph(): void;

    drawPath(y: number, value: number, ghost?: boolean): void;

    animateIn(fast?: boolean): void;

    animateOut(): void;

    override destroy(): null;
}
