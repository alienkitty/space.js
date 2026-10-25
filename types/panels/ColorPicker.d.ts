import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import type { HeaderInfo } from '../ui/HeaderInfo.js';
import type { Point } from '../ui/Point.js';
import type { Point3D } from '../three/ui/Point3D.js';

export type ColorPickerInstance =
    | ColorPicker
    | HeaderInfo
    | Point
    | Point3D;

export interface ColorPickerEvent {
    open: boolean;
    target: ColorPickerInstance;
}

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
    name: string;
    value: Color | number | string;
    noSwatch: boolean;
    noText: boolean;
    callback: (value: Color, target: ColorPicker) => void;

    width: number;
    height: number;
    middle: number;
    top: number;
    distance: number;
    ratio: number;
    triangleRadius: number;
    triangleSideLength: number;

    bounds: DOMRect | null;
    offset: Vector2;
    marker: Vector2;
    isOpen: boolean;
    isDown: boolean;
    firstDown: boolean;
    lastCursor: string;
    fastClose: boolean;

    h: number;
    s: number;
    l: number;

    color: Color;

    container?: Interface;
    swatch?: Interface;
    content?: Interface;
    colorRing?: Interface & {
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

    init(): void;

    initColorRing(): void;

    createGradient(type: string, props: Record<string, any>, colors: { offset: string; stopColor: string; stopOpacity: number }[]): Interface;

    addListeners(): void;

    removeListeners(): void;

    onColorPicker: (e: { open: boolean }) => void;

    onClick: () => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: () => void;

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
