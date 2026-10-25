import { Interface } from '../utils/Interface.js';
import { NavTitle } from './NavTitle.js';
import { NavLink } from './NavLink.js';
import { HeaderInfo } from './HeaderInfo.js';

import type { NavTitleData, NavTitleOptions } from './NavTitle.js';
import type { NavLinkOptions } from './NavLink.js';

export interface HeaderOptions {
    fps: boolean;
    fpsOpen: boolean;
}

export interface HeaderData {
    title: Partial<NavTitleOptions & NavTitleData>;
    links: Partial<NavLinkOptions>[];
}

/**
 * Header layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Header.js | Source}
 */
export class Header extends Interface {
    fps: boolean;
    fpsOpen: boolean;
    data: Partial<HeaderData>;

    links: NavLink[];

    title?: NavTitle;
    info?: HeaderInfo;

    constructor(options: Partial<HeaderOptions & HeaderData>);

    init(): void;

    initViews(): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(): void;
}
