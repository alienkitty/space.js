import type { EasingFunction, EasingName } from './Easing.js';

/**
 * Tween animation engine.
 *
 * @example
 * ticker.start();
 *
 * const data = {
 *     radius: 0
 * };
 *
 * tween(data, { radius: 24, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic', null, () => {
 *     console.log(data.radius);
 * });
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://easings.net/ | Easing Functions Cheat Sheet}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export class Tween {
    private object: any;
    private duration: number;
    private elapsed: number;
    private ease: EasingFunction;
    private delay: number;
    private complete: (() => void) | null;
    private update: (() => void) | null;
    private isAnimating: boolean;

    private from: Record<string, number>;
    private to: Record<string, number>;

    private spring?: number;
    private damping?: number;

    constructor(
        object: any,
        props: Record<string, any> | null,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        delay?: number | null,
        complete?: (() => void) | null,
        update?: (() => void) | null
    );
    constructor(
        object: any,
        props: Record<string, any> | null,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        complete?: (() => void) | null,
        update?: (() => void) | null
    );

    private onUpdate: (time: number, delta: number) => void;

    start(): void;

    stop(): void;
}

/**
 * Defers a function by the given duration.
 *
 * @example
 * delayedCall(500, animateIn);
 *
 * @example
 * delayedCall(500, () => animateIn(delay));
 *
 * @example
 * timeout = delayedCall(500, () => animateIn(delay));
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export function delayedCall(duration: number, complete: () => void): Tween;

/**
 * Defers by the given duration.
 *
 * @example
 * await wait(250);
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export function wait(duration?: number): Promise<void>;

/**
 * Defers to the next tick.
 *
 * @example
 * defer(resize);
 *
 * @example
 * defer(() => resize());
 *
 * @example
 * await defer();
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export function defer(complete?: () => void): Promise<void>;

/**
 * Tween that animates to the given destination properties.
 *
 * @example
 * tween(data, { value: 0.3 }, 1000, 'linear');
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://easings.net/ | Easing Functions Cheat Sheet}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export function tween(
    object: any,
    props: Record<string, any>,
    duration: number,
    ease?: EasingName | EasingFunction | string,
    delay?: number | null,
    complete?: (() => void) | null,
    update?: (() => void) | null
): Promise<void>;
export function tween(
    object: any,
    props: Record<string, any>,
    duration: number,
    ease?: EasingName | EasingFunction | string,
    complete?: (() => void) | null,
    update?: (() => void) | null
): Promise<void>;

/**
 * Immediately clears all delayedCalls and tweens of a given object.
 *
 * @example
 * delayedCall(500, animateIn);
 * clearTween(animateIn);
 *
 * @example
 * clearTween(timeout);
 * timeout = delayedCall(500, () => animateIn());
 *
 * @example
 * tween(data, { value: 0.3 }, 1000, 'linear');
 * clearTween(data);
 *
 * @see {@link https://github.com/alienkitty/space.js/wiki/Tween | Documentation}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Tween.js | Source}
 */
export function clearTween(object: any): void;
