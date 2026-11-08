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
    name: string;
    min: number;
    max: number;
    step: number;
    precision: number;
    value: number;
    callback: (value: number, target: Slider) => void;

    range: number;
    lastValue: number;

    bounds: DOMRect | null;
    origin: Vector2;
    mouse: Vector2;
    delta: Vector2;
    lastMouse: Vector2;
    lastOrigin: Vector2;

    container?: Interface;
    content?: Interface;
    number?: Interface;
    line?: Interface;
    group?: Interface;

    constructor(options: Partial<SliderOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    getPrecision(value: number): number;

    getValue(value: number): number;

    onPointerDown: (e: PointerEvent) => null;

    onPointerMove: (e: PointerEvent) => null;

    onPointerUp: () => null;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setValue(value: number, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
