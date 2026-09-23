import { EventEmitter } from './EventEmitter.js';

import type { EasingFunction, EasingName } from '../tween/Easing.js';

// https://developer.mozilla.org/en-US/docs/Web/CSS/transform
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter
export interface CSSProps {
    // Transforms
    x?: number;
    y?: number;
    z?: number;
    skewX?: number;
    skewY?: number;
    rotation?: number;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    // Filters
    blur?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    hue?: number;
    invert?: number;
    saturate?: number;
    sepia?: number;
    // Numeric (string allowed)
    opacity?: number | string;
    zIndex?: number | string;
    fontWeight?: number | string;
    strokeWidth?: number | string;
    strokeDashoffset?: number | string;
    stopOpacity?: number | string;
    flexGrow?: number | string;
    // Any other CSS property
    [key: string]: number | string | undefined;
}

/**
 * A base class for HTML elements with tween and destroy methods, plus helper methods for common utilities.
 *
 * @example
 * const logo = new Interface('.logo');
 * logo.css({
 *     position: 'absolute',
 *     left: '50%',
 *     top: '50%',
 *     width: 90,
 *     height: 86,
 *     marginLeft: -90 / 2,
 *     marginTop: -86 / 2 - 65,
 *     webkitUserSelect: 'none',
 *     userSelect: 'none',
 *     scale: 0.96,
 *     opacity: 0
 * });
 * document.body.appendChild(logo.element);
 *
 * const image = new Interface(null, 'img');
 * image.attr({
 *     src: 'assets/images/alienkitty.svg'
 * });
 * image.css({
 *     width: '100%',
 *     height: 'auto'
 * });
 * logo.add(image);
 *
 * logo.tween({ scale: 1, opacity: 1 }, 2000, 'easeOutCubic');
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Interface.js | Source}
 */
export class Interface {
    events: EventEmitter;
    children: (Interface | any)[] | null;
    style: Record<string, number>;
    isTransform: boolean;
    isFilter: boolean;

    element: HTMLElement | SVGElement | null;

    constructor(name?: string | HTMLElement | SVGElement | null, type?: string | null, qualifiedName?: string);

    add(child: Interface | any): Interface | any;

    addBefore(child: Interface | any, object: Interface | any): Interface | any;

    remove(child: Interface | any): void;

    replace(oldChild: Interface | any, newChild: Interface | any): void;

    clone(deep?: boolean): Interface;

    empty(): this | undefined;

    attr(props: Record<string, string | number>): this | undefined;

    css(props: CSSProps): this | undefined;

    text(string?: string): this | string | undefined;

    html(string?: string): this | string | undefined;

    hide(): this | undefined;

    show(): this | undefined;

    invisible(): this | undefined;

    visible(): this | undefined;

    inView(): boolean | undefined;

    atPoint(p: { x: number; y: number }): boolean | undefined;

    intersects(object: Interface | any): boolean | undefined;

    drawLine(progress?: number): this | undefined;

    tween(
        props: CSSProps,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        delay?: number | null,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void> | undefined;
    tween(
        props: CSSProps,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void> | undefined;

    clearTween(): this;

    destroy(): null;
}
