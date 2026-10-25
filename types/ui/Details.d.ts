import { Interface } from '../utils/Interface.js';
import { DetailsLink } from './DetailsLink.js';

import type { DetailsLinkOptions } from './DetailsLink.js';
import type { GraphOptions } from './Graph.js';
import type { GraphSegmentsOptions } from './GraphSegments.js';
import type { MeterOptions } from './Meter.js';

export interface DetailsContentData {
    group: Partial<DetailsContentData>[];
    width: string | number;
    title: string;
    content: string;
    graph: Partial<GraphOptions> | Partial<GraphSegmentsOptions>;
    meter: Partial<MeterOptions>;
    links: Partial<DetailsLinkOptions>[];
}

export interface DetailsData {
    width: string;
    background: boolean;
    dividerLine: boolean;
    title: string;
    content: Partial<DetailsContentData> | Partial<DetailsContentData>[];
}

/**
 * Details fullscreen 2-column layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Details.js | Source}
 */
export class Details extends Interface {
    data: Partial<DetailsData>;

    width: string;
    content: Interface[];
    links: DetailsLink[];
    animatedIn: boolean;

    bg?: Interface;
    dividerLine?: Interface;
    container?: Interface;
    title?: Interface;

    constructor(data: Partial<DetailsData>);

    init(): void;

    initViews(): void;

    addContent(target: Interface, data: Partial<DetailsContentData>): void;

    addListeners(): void;

    removeListeners(): void;

    onClick: (e: MouseEvent) => void;

    setData(data: Partial<DetailsData>): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
