import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Panel } from '../panels/Panel.js';

import type { PanelItem } from '../panels/PanelItem.js';
import type { ColorPicker } from '../panels/ColorPicker.js';

export interface HeaderInfoOptions {
    fpsOpen: boolean;
}

/**
 * Header info and panel container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/HeaderInfo.js | Source}
 */
export class HeaderInfo extends Interface {
    fpsOpen: boolean;

    time: number;
    count: number;
    prev: number;
    fps: number;

    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    openColor: ColorPicker | null;
    isOpen: boolean;

    number?: Interface;
    panel?: Panel;

    constructor(options: Partial<HeaderInfoOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    addPanel(item: PanelItem): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
