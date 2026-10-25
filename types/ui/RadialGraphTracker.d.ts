import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';

import type { TargetNumberData } from './TargetNumber.js';

/**
 * Radial graph tracker.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/RadialGraphTracker.js | Source}
 */
export class RadialGraphTracker extends Interface {
    position: Vector2;
    origin: Vector2;
    originPosition: Vector2;
    graphHeight: number;
    locked: boolean;
    animatedIn: boolean;
    isInstanced: boolean;
    isVisible: boolean;
    isOpen: boolean;

    number?: TargetNumber;

    constructor();

    init(): void;

    setData(data: TargetNumberData): void;

    update(): void;

    lock(): void;

    unlock(): void;

    activate(): void;

    deactivate(): void;

    open(): void;

    close(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
