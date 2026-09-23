import { Interface } from '../utils/Interface.js';
import { MenuItem } from './MenuItem.js';

export interface MenuOptions {
    bottom: boolean;
    itemWidth: number | string;
    items: string[];
    active: number;
    callback: (name: string, target: Menu) => void;
}

/**
 * Menu.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Menu.js | Source}
 */
export class Menu extends Interface {
    private bottom: boolean;
    private itemWidth: number | string;
    private names: string[];
    private index: number;
    private callback: (name: string, target: Menu) => void;

    private active: number;
    private items: MenuItem[];

    constructor(options: Partial<MenuOptions>);

    private init(): void;

    private initViews(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent, { target }: { target: MenuItem }) => void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
