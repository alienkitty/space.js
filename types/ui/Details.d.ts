import { Interface } from '../utils/Interface.js';
import { DetailsLink } from './DetailsLink.js';

import type { GraphOptions } from './Graph.js';
import type { GraphSegmentsOptions } from './GraphSegments.js';

export interface DetailsContentData {
    group?: DetailsContentData[];
    width?: string;
    title?: string;
    content?: Interface | any;
    graph?: GraphOptions | GraphSegmentsOptions;
    name?: string;
    link?: string;
}

export interface DetailsData {
    width?: string;
    background?: boolean;
    dividerLine?: boolean;
    title?: string;
    content?: DetailsContentData | DetailsContentData[];
    link?: string;
}

/**
 * Details fullscreen 2-column layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Details.js | Source}
 */
export class Details extends Interface {
    private data: DetailsData;

    private width: string;
    private content: Interface[];
    private links: DetailsLink[];
    private animatedIn: boolean;

    private bg?: Interface;
    private dividerLine?: Interface;
    private container?: Interface;
    private title?: Interface;

    constructor(data: DetailsData);

    private init(): void;

    private initViews(): void;

    private addContent(target: Interface, data: DetailsContentData): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onClick: (e: MouseEvent) => void;

    setData(data: DetailsData): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
