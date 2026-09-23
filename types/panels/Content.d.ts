import { Interface } from '../utils/Interface.js';

export interface ContentOptions {
    callback: (value: undefined, target: Content) => void;
}

/**
 * A panel content container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/Content.js | Source}
 */
export class Content extends Interface {
    private callback: (value: undefined, target: Content) => void;

    private group?: Interface;

    constructor(options: Partial<ContentOptions>);

    private onUpdate: (e: { path: [string, number][], value: any, index: number, target: Interface }) => void;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    update(): void;
}
