import { Interface } from '../utils/Interface.js';

export interface LinkOptions {
    title: string;
    link: string;
    target: string;
}

/**
 * Link.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Link.js | Source}
 */
export class Link extends Interface {
    title: string;
    link: string;
    target: string;

    line?: Interface;

    constructor(options: Partial<LinkOptions>);

    init(): void;

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
