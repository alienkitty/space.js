import { Interface } from '../utils/Interface.js';

export interface FooterTitleOptions {
    link: string;
    target: string;
    callback: (target: FooterTitle) => void;
    name: string;
    caption: string;
}

export interface FooterTitleData {
    name: string;
    caption: string;
}

/**
 * Footer name and caption.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/FooterTitle.js | Source}
 */
export class FooterTitle extends Interface {
    link: string;
    target: string;
    callback: (target: FooterTitle) => void;
    data: Partial<FooterTitleData>;

    name?: Interface;
    caption?: Interface;

    constructor(options: Partial<FooterTitleOptions & FooterTitleData>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setData(data: Partial<FooterTitleOptions & FooterTitleData>): void;

    override destroy(): null;
}
