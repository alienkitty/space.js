import { Interface } from '../utils/Interface.js';

export interface InfoOptions {
    bottom: boolean;
    content: string;
}

export interface InfoData {
    content?: string;
}

/**
 * Info bottom-centre.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Info.js | Source}
 */
export class Info extends Interface {
    private bottom: boolean;
    private data: InfoData;

    private content?: Interface;

    constructor(options: Partial<InfoOptions>);

    private init(): void;

    setContent(content: Interface): void;

    animateIn(delay?: number): void;

    animateOut(callback?: () => void): void;
}
