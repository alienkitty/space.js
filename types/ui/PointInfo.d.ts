import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';
import { Panel } from '../panels/Panel.js';

import type { PointData } from './Point.js';
import type { PanelItem } from '../panels/PanelItem.js';

/**
 * Point info.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/PointInfo.js | Source}
 */
export class PointInfo extends Interface {
    numbers: TargetNumber[];
    locked: boolean;
    isOpen: boolean;

    container?: Interface;
    name?: Interface;
    type?: Interface;
    targetNumbers?: Interface;
    panel?: Panel;

    constructor();

    init(): void;

    setData(data: PointData): void;

    setTargetNumbers(targetNumbers: number[]): void;

    lock(): void;

    unlock(): void;

    addPanel(item: PanelItem): void;

    open(): void;

    close(fast?: boolean): void;

    animateIn(): void;

    animateOut(fast?: boolean, callback?: () => void): void;
}
