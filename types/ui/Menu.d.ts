import { Interface } from '../utils/Interface.js';
import { MenuItem } from './MenuItem.js';

export interface MenuUpdateEvent {
    active: string;
    index: number;
    target: Menu;
}

export interface MenuOptions {
    bottom: boolean;
    itemWidth: number | string;
    items: string[];
    active: string;
    callback: (name: string, target: Menu) => void;
}

/**
 * Menu.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Menu.js | Source}
 */
export class Menu extends Interface {
    bottom: boolean;
    itemWidth: number | string;
    names: string[];
    index: number;
    callback: (name: string, target: Menu) => void;

    active: number;
    items: MenuItem[];

    constructor(options: Partial<MenuOptions>);

    init(): void;

    initViews(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent, { target }: { target: MenuItem }) => void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
