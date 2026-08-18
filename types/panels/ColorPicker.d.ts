import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export interface ColorPickerOptions {
    name: string;
    value: Color | number | string;
    noSwatch: boolean;
    noText: boolean;
    callback: (value: Color, target: ColorPicker) => void;
}

/**
 * A triangle color picker based on the UIL `Color` class by lo-th.
 *
 * @see {@link https://github.com/lo-th/uil/blob/main/src/proto/Color.js | UIL `Color` Source}
 * @see {@link https://github.com/timjb/colortriangle | `ColorTriangle` HSL based color picker}
 * @see {@link https://github.com/mattfarina/farbtastic | Farbtastic: jQuery color picker plug-in}
 * @see {@link https://acko.net/blog/farbtastic-jquery-color-picker-plug-in/ | Farbtastic Color Picker}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/ColorPicker.js | Source}
 */
export class ColorPicker extends Interface {
    private name: string;
    private value: Color | number | string;
    private noSwatch: boolean;
    private noText: boolean;
    private callback: (value: Color, target: ColorPicker) => void;

    private width: number;
    private height: number;
    private middle: number;
    private top: number;
    private distance: number;
    private ratio: number;
    private triangleRadius: number;
    private triangleSideLength: number;

    private bounds: DOMRect | null;
    private offset: Vector2;
    private marker: Vector2;
    private isOpen: boolean;
    private isDown: boolean;
    private firstDown: boolean;
    private lastCursor: string;
    private fastClose: boolean;

    private h: number;
    private s: number;
    private l: number;

    private color: Color;

    private container?: Interface;
    private swatch?: Interface;
    private content?: Interface;
    private colorRing?: Interface & {
        defs: Interface;
        ring: Interface;
        sl: Interface;
        hue: Interface;
        saturation: Interface;
        lightness: Interface;
        hueMarker: Interface;
        slMarker: Interface;
    };

    constructor(options: Partial<ColorPickerOptions>);

    private init(): void;

    private initColorRing(): void;

    private createGradient(type: string, props: Record<string, any>, colors: { offset: string; stopColor: string; stopOpacity: number }[]): Interface;

    private addListeners(): void;

    private removeListeners(): void;

    private onColorPicker: (e: { open: boolean }) => void;

    private onClick: () => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: () => void;

    setCursor(cursor?: string): void;

    setHeight(): void;

    setValue(value: Color | number | string, notify?: boolean): void;

    setHSL(h: number, s: number, l: number, notify?: boolean): void;

    update(notify?: boolean): void;

    moveMarkers(): void;

    open(): void;

    close(): void;

    override destroy(): null;
}
