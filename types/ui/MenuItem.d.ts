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
    private width: number | string;
    private name: string;
    private index: number;

    private active: boolean;
    private animatedIn: boolean;

    private container?: Interface;
    private line?: Interface;

    constructor(options: Partial<MenuItemOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setName(name: string): void;

    activate(direction: number): void;

    deactivate(direction: number): void;

    animateIn(delay: number): void;

    animateOut(): void;

    override destroy(): null;
}
