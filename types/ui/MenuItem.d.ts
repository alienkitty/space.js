import { Interface } from '../utils/Interface.js';

export interface MenuItemOptions {
    width: number | string;
    name: string;
    index: number;
}

/**
 * Menu item.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/MenuItem.js | Source}
 */
export class MenuItem extends Interface {
    width: number | string;
    name: string;
    index: number;

    active: boolean;
    animatedIn: boolean;

    container?: Interface;
    line?: Interface;

    constructor(options: Partial<MenuItemOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setName(name: string): void;

    activate(direction: number): void;

    deactivate(direction: number): void;

    animateIn(delay: number): void;

    animateOut(): void;

    override destroy(): null;
}
