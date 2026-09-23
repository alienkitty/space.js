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
    private noCorners: boolean;

    private position: Vector2;
    private locked: boolean;
    private animatedIn: boolean;
    private isInstanced: boolean;
    private isVisible: boolean;

    private corners?: Interface;
    private tl?: Interface;
    private tr?: Interface;
    private br?: Interface;
    private bl?: Interface;
    private number?: TargetNumber;
    private info?: ReticleInfo;

    constructor(options?: Partial<TrackerOptions>);

    private init(): void;

    setData(data: TrackerData): void;

    update(): void;

    lock(): void;

    unlock(): void;

    activate(): void;

    deactivate(fast?: boolean): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
