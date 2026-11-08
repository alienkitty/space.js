import { Interface } from '../utils/Interface.js';

export interface PanelLinkOptions {
    name: string;
    value: string;
    callback: (value: string, target: PanelLink) => void;
}

/**
 * A panel link.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelLink.js | Source}
 */
export class PanelLink extends Interface {
    name: string;
    value: string;
    callback: (value: string, target: PanelLink) => void;

    line?: Interface;

    constructor(options: Partial<PanelLinkOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: () => void;

    setValue(value: string, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
