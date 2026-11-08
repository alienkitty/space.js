import { Interface } from '../utils/Interface.js';

export interface TargetNumberData {
    targetNumber: number | string;
}

/**
 * Target number.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/TargetNumber.js | Source}
 */
export class TargetNumber extends Interface {
    width: number;
    height: number;

    number?: Interface;

    constructor();

    init(): void;

    setData(data: Partial<TargetNumberData>): void;

    animateIn(delay?: number): void;

    animateOut(fast?: boolean): void;
}
