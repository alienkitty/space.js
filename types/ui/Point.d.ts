import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { PointInfo } from './PointInfo.js';

import type { Tracker } from './Tracker.js';
import type { RadialGraphTracker } from './RadialGraphTracker.js';
import type { ColorPicker } from '../panels/ColorPicker.js';
import type { PanelThumbnail } from '../panels/PanelThumbnail.js';

export interface PointUI {
    onHover: (e: { type: 'over' | 'out', isPoint: boolean }) => void;
    lock: () => void;
    unlock: () => void;
    show: () => void;
    hide: () => void;
    snap: () => void;
}

export interface PointData {
    name?: string;
    type?: string;
}

/**
 * 2D point with info and panel container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Point.js | Source}
 */
export class Point extends Interface {
    private ui: PointUI;
    private tracker: Tracker | RadialGraphTracker;

    private bounds: DOMRect | null;
    private position: Vector2;
    private target: Vector2;
    private origin: Vector2;
    private originPosition: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private lastOrigin: Vector2;
    private lerpSpeed: number;
    private animatedIn: boolean;
    private openColor: ColorPicker | null;
    private isOpen: boolean;
    private isMove: boolean;

    private info?: PointInfo;

    constructor(ui: PointUI, tracker: Tracker | RadialGraphTracker);

    private init(): void;

    private initViews(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    private onThumbnailDragging: (e: { dragging: boolean, target: PanelThumbnail }) => void;

    private onThumbnailSnap: (e: { element: HTMLDivElement | null }) => void;

    private onHover: (e: MouseEvent) => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    setData(data: PointData): void;

    setTargetNumbers(targetNumbers: number[]): void;

    update(): void;

    lock(): void;

    unlock(): void;

    open(): void;

    close(fast?: boolean): void;

    animateIn(): void;

    animateOut(fast?: boolean): void;

    enable(): void;

    disable(): void;

    activate(): void;

    deactivate(toggle?: boolean): void;

    bringToFront(): void;

    sendToBack(): void;

    override destroy(): null;
}
