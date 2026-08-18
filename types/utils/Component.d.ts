import { EventEmitter } from './EventEmitter.js';

import type { EasingFunction, EasingName } from '../tween/Easing.js';

/**
 * A base class for components with tween and destroy methods.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Component.js | Source}
 */
export class Component {
    events: EventEmitter;
    children: (Component | any)[];

    constructor();

    add(child: Component | any): Component | any;

    remove(child: Component | any): void;

    tween(
        props: Record<string, any>,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        delay?: number | null,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void>;
    tween(
        props: Record<string, any>,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void>;

    clearTween(): this;

    destroy(): null;
}
