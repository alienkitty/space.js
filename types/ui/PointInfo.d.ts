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
    private numbers: TargetNumber[];
    private locked: boolean;
    private isOpen: boolean;

    private container?: Interface;
    private name?: Interface;
    private type?: Interface;
    private targetNumbers?: Interface;
    private panel?: Panel;

    constructor();

    private init(): void;

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
