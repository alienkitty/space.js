import { Interface } from '../utils/Interface.js';

/**
 * Title.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Title.js | Source}
 */
export class Title extends Interface {
    private title: string;

    private letters: string[];

    constructor(title: string);

    private init(): void;

    private initText(): void;

    setTitle(title: string, direction: number): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
