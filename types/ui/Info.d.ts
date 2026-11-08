import { Interface } from '../utils/Interface.js';

export interface InfoOptions {
    bottom: boolean;
}

export interface InfoData {
    content: string;
}

/**
 * Info bottom-centre.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Info.js | Source}
 */
export class Info extends Interface {
    bottom: boolean;
    data: Partial<InfoData>;

    content?: Interface;

    constructor(options: Partial<InfoOptions & InfoData>);

    init(): void;

    setContent(content: string): void;

    animateIn(delay?: number): void;

    animateOut(callback?: () => void): void;
}
