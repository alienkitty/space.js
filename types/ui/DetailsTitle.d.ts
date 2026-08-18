import { Interface } from '../utils/Interface.js';

/**
 * Details title.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsTitle.js | Source}
 */
export class DetailsTitle extends Interface {
    private title: string;

    private letters: string[];

    constructor(title: string);

    private init(): void;

    private initText(): void;

    setTitle(title: string): void;

    animateIn(): void;
}
