import { Interface } from '../utils/Interface.js';
import { ListToggle } from './ListToggle.js';
import { ListSelect } from './ListSelect.js';

export interface ListOptions {
    name: string;
    list: Map<string, any>;
    value: string;
    callback: (value: string, target: List) => void;
}

/**
 * A panel displaying either a toggle or rotating list.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/List.js | Source}
 */
export class List extends Interface {
    name: string;
    list: Map<string, any>;
    keys: string[];
    values: any[];
    index: number;
    callback: (value: string, target: List) => void;

    items: (ListToggle | ListSelect)[];

    container?: Interface;
    group?: Interface;

    constructor(options: Partial<ListOptions>);

    init(): void;

    initViews(): void;

    removeListeners(): void;

    onClick: (e: { target: { index: number } }) => void;

    onUpdate: (e: any) => void;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setList(list: Map<string, any>): void;

    setIndex(index: number, notify?: boolean): void;

    setValue(value: string, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
