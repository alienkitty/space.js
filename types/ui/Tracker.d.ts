import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';
import { ReticleInfo } from './ReticleInfo.js';

import type { TargetNumberData } from './TargetNumber.js';
import type { ReticleData } from './Reticle.js';

export interface TrackerOptions {
    noCorners: boolean;
}

export type TrackerData = TargetNumberData & ReticleData;

/**
 * Tracker.
 *
 * TODO: JSDoc examples
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Tracker.js | Source}
 */
export class Tracker extends Interface {
    noCorners: boolean;

    position: Vector2;
    locked: boolean;
    animatedIn: boolean;
    isInstanced: boolean;
    isVisible: boolean;

    corners?: Interface;
    tl?: Interface;
    tr?: Interface;
    br?: Interface;
    bl?: Interface;
    number?: TargetNumber;
    info?: ReticleInfo;

    constructor(options?: Partial<TrackerOptions>);

    init(): void;

    setData(data: Partial<TrackerData>): void;

    update(): void;

    lock(): void;

    unlock(): void;

    activate(): void;

    deactivate(fast?: boolean): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
