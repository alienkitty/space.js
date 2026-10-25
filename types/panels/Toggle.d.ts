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
    name: string;
    value: boolean;
    callback: (value: boolean, target: Toggle) => void;

    container?: Interface;
    content?: Interface;
    circle?: Interface;
    group?: Interface;

    constructor(options: Partial<ToggleOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    onClick: () => void;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setValue(value: boolean, notify?: boolean): void;

    update(notify?: boolean): void;

    override destroy(): null;
}
