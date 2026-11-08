import { Interface } from '../utils/Interface.js';

export interface PanelInfoOptions {
    name: string;
    value: number | string;
}

/**
 * An info panel.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelInfo.js | Source}
 */
export class PanelInfo extends Interface {
    name: string;
    value: number | string;

    container?: Interface;
    content?: Interface;
    number?: Interface;

    constructor(options: Partial<PanelInfoOptions>);

    init(): void;

    setValue(value: number | string): void;
}
