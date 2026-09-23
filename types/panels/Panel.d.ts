import { Interface } from '../utils/Interface.js';

import type { PanelItem } from './PanelItem.js';
import type { ColorPicker } from './ColorPicker.js';

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
    private invertColors: {
        light: string;
        lightTriplet: string;
        lightLine: string;
        dark: string;
        darkTriplet: string;
        darkLine: string;
    };

    private startTime: number;
    private frame: number;

    private items: PanelItem[];
    private animatedIn: boolean;
    private openColor: ColorPicker | null;

    constructor();

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    private onUpdate: (e: any) => void;

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
