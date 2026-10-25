import { Interface } from '../utils/Interface.js';
import { NavTitle } from './NavTitle.js';
import { NavLink } from './NavLink.js';
import { FooterTitle } from './FooterTitle.js';

import type { NavTitleOptions } from './NavTitle.js';
import type { NavLinkOptions } from './NavLink.js';
import type { FooterTitleData, FooterTitleOptions } from './FooterTitle.js';

export interface FooterData {
    title: Partial<NavTitleOptions>;
    links: Partial<NavLinkOptions>[];
    info: Partial<FooterTitleOptions & FooterTitleData>;
}

/**
 * Footer layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Footer.js | Source}
 */
export class Footer extends Interface {
    data: Partial<FooterData>;

    links: NavLink[];

    title?: NavTitle;
    info?: FooterTitle;

    constructor(data: Partial<FooterData>);

    init(): void;

    initViews(): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(): void;
}
