import { Interface } from '../utils/Interface.js';
import { NavTitle } from './NavTitle.js';
import { NavLink } from './NavLink.js';
import { HeaderInfo } from './HeaderInfo.js';

import type { NavTitleOptions } from './NavTitle.js';
import type { NavLinkOptions } from './NavLink.js';

export interface HeaderOptions {
	fps: boolean;
	fpsOpen: boolean;
	title: NavTitleOptions;
	links: NavLinkOptions[];
}

export interface HeaderData {
	title?: NavTitleOptions;
	links?: NavLinkOptions[];
}

/**
 * Header layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Header.js | Source}
 */
export class Header extends Interface {
	private fps: boolean;
	private fpsOpen: boolean;
	private data: HeaderData;

	private links: NavLink[];

	private title?: NavTitle;
	private info?: HeaderInfo;

	constructor(options: Partial<HeaderOptions>);

	private init(): void;

	private initViews(): void;

	resize(width: number, height: number, dpr: number, breakpoint: number): void;

	animateIn(): void;

	animateOut(): void;
}
