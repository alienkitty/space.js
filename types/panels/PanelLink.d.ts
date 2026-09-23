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
    private name: string;
    private value: string;
    private callback: (value: string, target: PanelLink) => void;

    private line?: Interface;

    constructor(options: Partial<PanelLinkOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: () => void;

    setValue(value: string, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
