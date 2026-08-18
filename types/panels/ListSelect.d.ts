import { Interface } from '../utils/Interface.js';

export interface ListSelectOptions {
    list: string[];
    index: number;
}

/**
 * A panel rotating list.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/ListSelect.js | Source}
 */
export class ListSelect extends Interface {
    private list: string[];
    private index: number;

    private active: boolean;

    private next: number;

    private content?: Interface;
    private over?: Interface;

    constructor(options: Partial<ListSelectOptions>);

    private init(): void;

    private getNextIndex(): number;

    private addListeners(): void;

    private removeListeners(): void;

    private onClick: () => void;

    setList(list: string[]): void;

    setIndex(index: number): void;

    override destroy(): null;
}
