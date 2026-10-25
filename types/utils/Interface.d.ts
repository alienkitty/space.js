import { EventEmitter } from './EventEmitter.js';

import type { Component } from './Component.js';
import type { EasingFunction, EasingName } from '../tween/Easing.js';

export type InterfaceElement = HTMLElement | SVGElement | HTMLCanvasElement | null;

export type InterfaceProgress = Interface<SVGElement> & {
    start: number;
    offset: number;
    progress: number;
};

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
export class Interface<TElement = HTMLDivElement> {
    events: EventEmitter;
    children: Interface<InterfaceElement>[];
    style: Record<string, number>;
    isTransform: boolean;
    isFilter: boolean;

    element: TElement;

    constructor(name?: string | InterfaceElement, type?: string | null, qualifiedName?: string);

    add(child: Interface<InterfaceElement> | Component): Interface<InterfaceElement> | Component;

    addBefore(child: Interface<InterfaceElement>, object: Interface<InterfaceElement>): Interface<InterfaceElement>;

    remove(child: Interface<InterfaceElement> | Component): void;

    replace(oldChild: Interface<InterfaceElement>, newChild: Interface<InterfaceElement>): void;

    clone(deep?: boolean): Interface<InterfaceElement>;

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

    intersects(object: Interface<InterfaceElement>): boolean | undefined;

    drawLine(progress?: number): this | undefined;

    tween(
        props: CSSProps,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void> | undefined;
    tween(
        props: CSSProps,
        duration: number,
        ease?: EasingName | EasingFunction | string,
        delay?: number | null,
        complete?: (() => void) | null,
        update?: (() => void) | null
    ): Promise<void> | undefined;

    clearTween(): this;

    destroy(): null;
}
