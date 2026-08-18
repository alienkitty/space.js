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
    private name: string;
    private list: Map<string, any>;
    private keys: string[];
    private values: any[];
    private index: number;
    private callback: (value: string, target: List) => void;

    private items: (ListToggle | ListSelect)[];

    private container?: Interface;
    private group?: Interface;

    constructor(options: Partial<ListOptions>);

    private init(): void;

    private initViews(): void;

    private removeListeners(): void;

    private onClick: (e: { target: { index: number } }) => void;

    private onUpdate: (e: any) => void;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setList(list: Map<string, any>): void;

    setIndex(index: number, notify?: boolean): void;

    setValue(value: string, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
