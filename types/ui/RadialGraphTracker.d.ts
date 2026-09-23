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
    private position: Vector2;
    private origin: Vector2;
    private originPosition: Vector2;
    private graphHeight: number;
    private locked: boolean;
    private animatedIn: boolean;
    private isInstanced: boolean;
    private isVisible: boolean;
    private isOpen: boolean;

    private number?: TargetNumber;

    constructor();

    private init(): void;

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
