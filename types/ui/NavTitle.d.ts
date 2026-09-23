import { Interface } from '../utils/Interface.js';

export interface NavTitleOptions {
    link: string;
    target: string;
    callback: (target: NavTitle) => void;
    name: string;
    caption: string;
}

export interface NavTitleData {
    name?: string;
    caption?: string;
}

/**
 * Navigation name and caption.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/NavTitle.js | Source}
 */
export class NavTitle extends Interface {
    private link: string;
    private target: string;
    private callback: (target: NavTitle) => void;
    private data: NavTitleData;

    private name?: Interface;
    private caption?: Interface;

    constructor(options: Partial<NavTitleOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setData(data: Partial<NavTitleOptions>): void;

    override destroy(): null;
}
