import { Color } from '../math/Color.js';
import { Interface } from '../utils/Interface.js';

export interface MeterOptions {
    value: number;
    ghost: number;
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
    private value: number;
    private ghost: number;
    private width: number;
    private precision: number;
    private range: number;
    private format: (value: number) => string;
    private noRange: boolean;
    private noText: boolean;
    private noGradient: boolean;

    private startTime: number;
    private frame: number;

    private height: number;
    private rangeWidth: number;
    private animatedIn: boolean;
    private needsUpdate: boolean;

    private lineColors: {
        graph: string,
        bottom: string
    };

    private colorRange: Color[];

    private colorStep: number;
    private color: Color;
    private alpha: number;

    private props: {
        xMultiplier: number;
        progress: number;
    };

    private container?: Interface;
    private number?: Interface;
    private info?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;

    constructor(options?: Partial<MeterOptions>);

    private init(): Promise<void>;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private getRangeWidth(range: number): number;

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
