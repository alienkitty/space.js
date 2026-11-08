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
    title: string;
    link: string;
    target: string;

    letters: string[];

    constructor(options: Partial<NavLinkOptions>);

    init(): void;

    initText(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setTitle(title: string): void;

    setLink(link: string): void;

    setTarget(target: string): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
