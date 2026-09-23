import { Component } from '../utils/Component.js';

import type { Interface } from '../utils/Interface.js';

export interface MagneticOptions {
    threshold: number;
}

/**
 * A mouse interaction based on the `Magnetic` class by Jesper Landberg.
 *
 * @see {@link https://gist.github.com/jesperlandberg/66484c7bb456661662f57361851bfc31 | `Magnetic` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/extras/Magnetic.js | Source}
 */
export class Magnetic extends Component {
    private object: Interface;
    private threshold: number;
    private hoveredIn: boolean;

    constructor(object: Interface, options?: Partial<MagneticOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    private onHover: (e: { type: 'over' | 'out', x: number, y: number }) => void;

    enable(): void;

    disable(): void;

    override destroy(): null;
}
