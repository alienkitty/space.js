import { Interface } from '../utils/Interface.js';

export interface ListToggleOptions {
    name: string;
    index: number;
}

/**
 * A panel toggle for a single list item.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/ListToggle.js | Source}
 */
export class ListToggle extends Interface {
    private name: string;
    private index: number;

    private active: boolean;

    private content?: Interface;
    private over?: Interface;

    constructor(options: Partial<ListToggleOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: () => void;

    setName(name: string): void;

    activate(): void;

    deactivate(): void;

    override destroy(): null;
}
