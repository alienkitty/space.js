import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';

export interface DetailsInfoData {
    title: string;
    content: string;
}

/**
 * Details minimal bottom-left layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsInfo.js | Source}
 */
export class DetailsInfo extends Interface {
    data: Partial<DetailsInfoData>;

    animatedIn: boolean;

    container?: Interface;
    title?: DetailsTitle;
    info?: Interface;

    constructor(data: Partial<DetailsInfoData>);

    init(): void;

    initViews(): void;

    setData(data: Partial<DetailsInfoData>): void;

    setContent(content: string): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
