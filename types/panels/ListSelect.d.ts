import { Interface } from '../utils/Interface.js';

export interface ListSelectClickEvent {
    target: ListSelect;
}

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
    list: string[];
    index: number;

    active: boolean;

    next: number;

    content?: Interface;
    over?: Interface;

    constructor(options: Partial<ListSelectOptions>);

    init(): void;

    getNextIndex(): number;

    addListeners(): void;

    removeListeners(): void;

    onClick: () => void;

    setList(list: string[]): void;

    setIndex(index: number): void;

    override destroy(): null;
}
