import { Interface } from '../utils/Interface.js';
import { NavTitle } from './NavTitle.js';
import { NavLink } from './NavLink.js';
import { FooterTitle } from './FooterTitle.js';

import type { NavTitleOptions } from './NavTitle.js';
import type { NavLinkOptions } from './NavLink.js';
import type { FooterTitleOptions } from './FooterTitle.js';

export interface FooterData {
    title?: NavTitleOptions;
    links?: NavLinkOptions[];
    info?: FooterTitleOptions;
}

/**
 * Footer layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Footer.js | Source}
 */
export class Footer extends Interface {
    private data: FooterData;

    private links: NavLink[];

    private title?: NavTitle;
    private info?: FooterTitle;

    constructor(data: FooterData);

    private init(): void;

    private initViews(): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(): void;
}
