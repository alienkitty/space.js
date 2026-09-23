import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';

export interface DetailsInfoData {
    title?: string;
    content?: string;
}

/**
 * Details minimal bottom-left layout.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsInfo.js | Source}
 */
export class DetailsInfo extends Interface {
    private data: DetailsInfoData;

    private animatedIn: boolean;

    private container?: Interface;
    private title?: DetailsTitle;
    private info?: Interface;

    constructor(data: DetailsInfoData);

    private init(): void;

    private initViews(): void;

    setData(data: DetailsInfoData): void;

    setContent(content: string): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;
}
