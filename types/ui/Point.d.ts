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
    name: string;
    type: string;
}

/**
 * 2D point with info and panel container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Point.js | Source}
 */
export class Point extends Interface {
    ui: PointUI;
    tracker: Tracker | RadialGraphTracker;

    bounds: DOMRect | null;
    position: Vector2;
    target: Vector2;
    origin: Vector2;
    originPosition: Vector2;
    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    lastOrigin: Vector2;
    lerpSpeed: number;
    animatedIn: boolean;
    openColor: ColorPicker | null;
    isOpen: boolean;
    isMove: boolean;

    info?: PointInfo;

    constructor(ui?: PointUI, tracker?: Tracker | RadialGraphTracker);

    init(): void;

    initViews(): void;

    addListeners(): void;

    removeListeners(): void;

    onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    onThumbnailDragging: (e: { dragging: boolean, target: PanelThumbnail }) => void;

    onThumbnailSnap: (e: { element: HTMLDivElement | null }) => void;

    onHover: (e: MouseEvent) => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    setData(data: Partial<PointData>): void;

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
