import { Interface } from '../utils/Interface.js';

export interface NavLinkOptions {
    title: string;
    link: string;
    target: string;
}

/**
 * Navigation link.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/NavLink.js | Source}
 */
export class NavLink extends Interface {
    private title: string;
    private link: string;
    private target: string;

    private letters: string[];

    constructor(options: Partial<NavLinkOptions>);

    private init(): void;

    private initText(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setTitle(title: string): void;

    setLink(link: string): void;

    setTarget(target: string): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
