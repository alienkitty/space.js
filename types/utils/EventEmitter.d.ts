/**
 * A simple implementation of `EventTarget` with `Map()` and event parameter spread.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#simple_implementation_of_eventtarget | Simple implementation of EventTarget}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js | three.js `EventDispatcher` Source}
 * @see {@link https://github.com/brunosimon/folio-2019/blob/master/src/javascript/Utils/EventEmitter.js | Bruno Simon's `EventEmitter` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/EventEmitter.js | Source}
 */
export class EventEmitter {
    map: Map<string, ((...args: any[]) => void)[]>;

    constructor();

    on(type: string, callback: (...args: any[]) => void): void;

    off(type: string, callback: (...args: any[]) => void): void;

    emit(type: string, ...event: any[]): void;

    destroy(): null;
}
