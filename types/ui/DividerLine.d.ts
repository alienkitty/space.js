import { Interface } from '../utils/Interface.js';

/**
 * Divider line.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DividerLine.js | Source}
 */
export class DividerLine extends Interface {
    private top?: Interface;
    private bottom?: Interface;

    constructor();

    private init(): void;

    setLeft(left: number): void;

    animateIn(): void;

    animateOut(): void;
}
