import { Interface } from '../utils/Interface.js';

export interface ListToggleClickEvent {
    target: ListToggle;
}

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
    name: string;
    index: number;

    active: boolean;

    content?: Interface;
    over?: Interface;

    constructor(options: Partial<ListToggleOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: () => void;

    setName(name: string): void;

    activate(): void;

    deactivate(): void;

    override destroy(): null;
}
