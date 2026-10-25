import { Interface } from '../utils/Interface.js';

export interface DetailsLinkOptions {
    title: string;
    link: string;
    target: string;
}

/**
 * Details link.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsLink.js | Source}
 */
export class DetailsLink extends Interface {
    title: string;
    link: string;
    target: string;

    content?: Interface;
    line?: Interface;

    constructor(options: Partial<DetailsLinkOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setTitle(title: string): void;

    setLink(link: string): void;

    setTarget(target: string): void;

    override destroy(): null;
}
