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
    private title: string;
    private link: string;
    private target: string;

    private line?: Interface;

    constructor(options: Partial<LinkOptions>);

    private init(): void;

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
