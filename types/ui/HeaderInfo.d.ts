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
    private fpsOpen: boolean;

    private time: number;
    private count: number;
    private prev: number;
    private fps: number;

    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private openColor: ColorPicker | null;
    private isOpen: boolean;

    private number?: Interface;
    private panel?: Panel;

    constructor(options: Partial<HeaderInfoOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    addPanel(item: PanelItem): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
