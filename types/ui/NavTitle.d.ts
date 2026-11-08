import { Interface } from '../utils/Interface.js';

export interface NavTitleOptions {
    link: string;
    target: string;
    callback: (target: NavTitle) => void;
}

export interface NavTitleData {
    name: string;
    caption: string;
}

/**
 * Navigation name and caption.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/NavTitle.js | Source}
 */
export class NavTitle extends Interface {
    link: string;
    target: string;
    callback: (target: NavTitle) => void;
    data: Partial<NavTitleData>;

    name?: Interface;
    caption?: Interface;

    constructor(options: Partial<NavTitleOptions & NavTitleData>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setData(data: Partial<NavTitleOptions & NavTitleData>): void;

    override destroy(): null;
}
