import { Interface } from '../utils/Interface.js';

import type { PanelItem } from './PanelItem.js';
import type { ColorPicker } from './ColorPicker.js';

export interface PanelTargetEvent {
    target: any;
}

export interface PanelUpdateEvent {
    path: [string, number][];
    value?: any;
    index?: number;
    target: any;
}

/**
 * A panel container for various components.
 *
 * @example
 * const panel = new Panel();
 * const item = new PanelItem({
 *     // name: 'FPS'
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
 *     type: 'color'
 * });
 * panel.add(item);
 * panel.animateIn();
 * document.body.appendChild(panel.element);
 *
 * function animate() {
 *     requestAnimationFrame(animate);
 *
 *     panel.update();
 * }
 *
 * requestAnimationFrame(animate);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/Panel.js | Source}
 */
export class Panel extends Interface {
    invertColors: {
        light: string;
        lightTriplet: string;
        lightLine: string;
        dark: string;
        darkTriplet: string;
        darkLine: string;
    };

    startTime: number;
    frame: number;

    items: PanelItem[];
    animatedIn: boolean;
    openColor: ColorPicker | null;

    constructor();

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    onUpdate: (e: any) => void;

    add(item: PanelItem): PanelItem;

    getPanelIndex(name: string): number | undefined;

    getPanelValue(name: string): any;

    setPanelIndex(name: string, index: number, notify?: boolean, path?: [string, number][]): void;

    setPanelValue(name: string, value: any, notify?: boolean, path?: [string, number][]): void;

    invert(isInverted: boolean): void;

    update(): void;

    animateIn(fast?: boolean): void;

    animateOut(callback?: () => void): void;

    enable(): void;

    disable(target?: Interface): void;

    activate(): void;

    deactivate(): void;

    override destroy(): null;
}
