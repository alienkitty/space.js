import { Interface } from '../utils/Interface.js';

export interface FooterTitleOptions {
    link: string;
    target: string;
    callback: (target: FooterTitle) => void;
    name: string;
    caption: string;
}

export interface FooterTitleData {
    name?: string;
    caption?: string;
}

/**
 * Footer name and caption.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/FooterTitle.js | Source}
 */
export class FooterTitle extends Interface {
    private link: string;
    private target: string;
    private callback: (target: FooterTitle) => void;
    private data: FooterTitleData;

    private name?: Interface;
    private caption?: Interface;

    constructor(options: Partial<FooterTitleOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setData(data: Partial<FooterTitleOptions>): void;

    override destroy(): null;
}
