import { Color } from '../math/Color.js';
import { Interface } from '../utils/Interface.js';

export interface PanelMeterOptions {
    name: string;
    precision: number;
    range: number;
    suffix: string;
    format: (value: string) => string;
    value: number;
    ghost: number | boolean;
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
    name: string;
    precision: number;
    range: number;
    format: (value: string) => string;
    value: number;
    ghost: number | boolean;
    noText: boolean;
    noGradient: boolean;
    callback: (value: number, target: PanelMeter) => void;

    height: number;
    width: number;
    rangeWidth: number;
    needsUpdate: boolean;

    lineColors: {
        graph: string,
        bottom: string
    };

    colorRange: Color[];

    colorStep: number;
    color: Color;
    alpha: number;

    last: number;
    time: number;
    delta: number;
    count: number;
    prev: number;
    fps: number;

    refreshRate120: number;
    refreshRate240: number;

    container?: Interface;
    content?: Interface;
    number?: Interface;
    info?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;
    strokeStyle?: CanvasGradient;

    constructor(options: Partial<PanelMeterOptions>);

    init(): Promise<void>;

    initCanvas(): void;

    createGradient(x0: number, y0: number, x1: number, y1: number, alpha?: number): CanvasGradient;

    toRGBA(color: Color, alpha: number): string;

    addListeners(): void;

    removeListeners(): void;

    getRangeWidth(range: number): number;

    onUpdate: () => void;

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
