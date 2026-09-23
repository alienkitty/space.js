import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export interface SliderOptions {
    name: string;
    min: number;
    max: number;
    step: number;
    value: number;
    callback: (value: number, target: Slider) => void;
}

/**
 * A panel slider based on the UIL `Slide` class by lo-th.
 *
 * @see {@link https://github.com/lo-th/uil/blob/main/src/proto/Slide.js | UIL `Slide` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/Slider.js | Source}
 */
export class Slider extends Interface {
    private name: string;
    private min: number;
    private max: number;
    private step: number;
    private precision: number;
    private value: number;
    private callback: (value: number, target: Slider) => void;

    private range: number;
    private lastValue: number;

    private bounds: DOMRect | null;
    private origin: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private lastMouse: Vector2;
    private lastOrigin: Vector2;

    private container?: Interface;
    private content?: Interface;
    private number?: Interface;
    private line?: Interface;
    private group?: Interface;

    constructor(options: Partial<SliderOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private getPrecision(value: number): number;

    private getValue(value: number): number;

    private onPointerDown: (e: PointerEvent) => null;

    private onPointerMove: (e: PointerEvent) => null;

    private onPointerUp: () => null;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setValue(value: number, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
