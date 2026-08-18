import { Interface } from '../utils/Interface.js';

export interface ToggleOptions {
    name: string;
    value: boolean;
    callback: (value: boolean, target: Toggle) => void;
}

/**
 * A panel toggle.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/Toggle.js | Source}
 */
export class Toggle extends Interface {
    private name: string;
    private value: boolean;
    private callback: (value: boolean, target: Toggle) => void;

    private container?: Interface;
    private content?: Interface;
    private circle?: Interface;
    private group?: Interface;

    constructor(options: Partial<ToggleOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onClick: () => void;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setValue(value: boolean, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
