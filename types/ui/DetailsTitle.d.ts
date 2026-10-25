import { Interface } from '../utils/Interface.js';

/**
 * Details title.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsTitle.js | Source}
 */
export class DetailsTitle extends Interface {
    title: string;

    letters: string[];

    constructor(title: string);

    init(): void;

    initText(): void;

    setTitle(title: string): void;

    animateIn(): void;
}
