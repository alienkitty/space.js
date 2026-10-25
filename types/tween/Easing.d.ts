export type EasingName =
    | 'linear'
    | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
    | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
    | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
    | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
    | 'easeInSine' | 'easeOutSine' | 'easeInOutSine'
    | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
    | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
    | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'
    | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic'
    | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

export type EasingFunction = (t: number, spring?: number, damping?: number) => number;

/**
 * A set of easing functions based on the original {@link https://robertpenner.com/easing/ | Robert Penner} equations.
 *
 * @see {@link https://github.com/danro/easing-js | easing.js}
 * @see {@link https://github.com/CreateJS/TweenJS | TweenJS}
 * @see {@link https://github.com/tweenjs/tween.js | tween.js}
 * @see {@link https://easings.net/ | Easing Functions Cheat Sheet}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Easing.js | Source}
 */
export class Easing {
    static linear(t: number): number;

    static easeInQuad(t: number): number;

    static easeOutQuad(t: number): number;

    static easeInOutQuad(t: number): number;

    static easeInCubic(t: number): number;

    static easeOutCubic(t: number): number;

    static easeInOutCubic(t: number): number;

    static easeInQuart(t: number): number;

    static easeOutQuart(t: number): number;

    static easeInOutQuart(t: number): number;

    static easeInQuint(t: number): number;

    static easeOutQuint(t: number): number;

    static easeInOutQuint(t: number): number;

    static easeInSine(t: number): number;

    static easeOutSine(t: number): number;

    static easeInOutSine(t: number): number;

    static easeInExpo(t: number): number;

    static easeOutExpo(t: number): number;

    static easeInOutExpo(t: number): number;

    static easeInCirc(t: number): number;

    static easeOutCirc(t: number): number;

    static easeInOutCirc(t: number): number;

    static easeInBack(t: number): number;

    static easeOutBack(t: number): number;

    static easeInOutBack(t: number): number;

    static easeInElastic(t: number, amplitude?: number, period?: number): number;

    static easeOutElastic(t: number, amplitude?: number, period?: number): number;

    static easeInOutElastic(t: number, amplitude?: number, period?: number): number;

    static easeInBounce(t: number): number;

    static easeOutBounce(t: number): number;

    static easeInOutBounce(t: number): number;

    static addBezier(name: string, mX1: number, mY1: number, mX2: number, mY2: number): number;
}
