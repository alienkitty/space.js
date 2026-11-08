import { Interface } from '../utils/Interface.js';

/**
 * Divider line.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DividerLine.js | Source}
 */
export class DividerLine extends Interface {
    top?: Interface;
    bottom?: Interface;

    constructor();

    init(): void;

    setLeft(left: number): void;

    animateIn(): void;

    animateOut(): void;
}
