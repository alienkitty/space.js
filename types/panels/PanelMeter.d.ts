import { Color } from '../math/Color.js';
import { Interface } from '../utils/Interface.js';

export interface PanelMeterOptions {
    name: string;
    precision: number;
    range: number;
    suffix: string;
    format: (value: string) => string;
    value: number;
    ghost: number;
    noText: boolean;
    noGradient: boolean;
    callback: (value: number, target: PanelMeter) => void;
}

/**
 * A panel meter.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelMeter.js | Source}
 */
export class PanelMeter extends Interface {
    private name: string;
    private precision: number;
    private range: number;
    private format: (value: string) => string;
    private value: number;
    private ghost: number;
    private noText: boolean;
    private noGradient: boolean;
    private callback: (value: number, target: PanelMeter) => void;

    private height: number;
    private width: number;
    private rangeWidth: number;
    private needsUpdate: boolean;

    private lineColors: {
        graph: string,
        bottom: string
    };

    private colorRange: Color[];

    private colorStep: number;
    private color: Color;
    private alpha: number;

    private last: number;
    private time: number;
    private delta: number;
    private count: number;
    private prev: number;
    private fps: number;

    private refreshRate120: number;
    private refreshRate240: number;

    private container?: Interface;
    private content?: Interface;
    private number?: Interface;
    private info?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;
    private strokeStyle?: CanvasGradient;

    constructor(options: Partial<PanelMeterOptions>);

    private init(): Promise<void>;

    private initCanvas(): void;

    private createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    private toRGBA(color: Color, alpha: number): string;

    private addListeners(): void;

    private removeListeners(): void;

    private getRangeWidth(range: number): number;

    private onUpdate: () => void;

    setRange(range: number): void;

    setValue(value?: number): void;

    setGhostValue(value?: number): void;

    resize(): void;

    update(value?: number): void;

    drawGraph(): void;

    drawPath(y: number, value: number, ghost?: boolean): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
