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
    private title: string;
    private link: string;
    private target: string;

    private content?: Interface;
    private line?: Interface;

    constructor(options: Partial<DetailsLinkOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setTitle(title: string): void;

    setLink(link: string): void;

    setTarget(target: string): void;

    override destroy(): null;
}
