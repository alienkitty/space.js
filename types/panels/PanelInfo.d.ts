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
    private name: string;
    private value: number | string;

    private container?: Interface;
    private content?: Interface;
    private number?: Interface;

    constructor(options: Partial<PanelInfoOptions>);

    private init(): void;

    setValue(value: number | string): void;
}
