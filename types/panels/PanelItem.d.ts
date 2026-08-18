import { Interface } from '../utils/Interface.js';

import type { PanelGraph } from './PanelGraph.js';
import type { PanelMeter } from './PanelMeter.js';

export interface PanelItemData {
    name?: string;
    type?:
        | 'spacer'
        | 'divider'
        | 'info'
        | 'link'
        | 'thumbnail'
        | 'graph'
        | 'meter'
        | 'list'
        | 'slider'
        | 'toggle'
        | 'content'
        | 'color';
    [key: string]: any;
}

/**
 * A panel item for various components.
 *
 * @example
 * // ...
 * const item = new PanelItem({
 *     name: 'FPS'
 *     // type: 'spacer'
 *     // type: 'divider'
 *     // type: 'info'
 *     // type: 'link'
 *     // type: 'thumbnail'
 *     // type: 'graph'
 *     // type: 'meter'
 *     // type: 'list'
 *     // type: 'slider'
 *     // type: 'toggle'
 *     // type: 'content'
 *     // type: 'color'
 * });
 * ui.addPanel(item);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelItem.js | Source}
 */
export class PanelItem extends Interface {
    private data: PanelItemData;

    private container?: Interface;
    private content?: Interface;
    private line?: Interface;
    private view?: any;
    private graph?: PanelGraph | PanelMeter;

    constructor(data: PanelItemData);

    private init(): void;

    private removeListeners(): void;

    private onUpdate: (e: any) => void;

    animateIn(delay?: number, fast?: boolean): void;

    animateOut(index: number, total: number, delay: number, callback?: () => void): void;

    enable(target?: Interface): void;

    disable(target?: Interface): void;

    override destroy(): null;
}
