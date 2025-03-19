/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#simple_implementation_of_eventtarget
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js
 * Based on https://github.com/brunosimon/folio-2019/blob/master/src/javascript/Utils/EventEmitter.js
 */

/**
 * A simple implementation of EventTarget with Map() based types,
 * and event parameter spread.
 */
export class EventEmitter {
    constructor() {
        this.map = new Map();
    }

    on(type, callback) {
        if (!this.map.has(type)) {
            this.map.set(type, new Array());
        }

        this.map.get(type).push(callback);
    }

    off(type, callback) {
        if (!this.map.has(type)) {
            return;
        }

        if (callback) {
            const array = this.map.get(type);
            const index = array.indexOf(callback);

            if (~index) {
                array.splice(index, 1);
            }
        } else {
            this.map.delete(type);
        }
    }

    emit(type, ...event) {
        if (!this.map.has(type)) {
            return;
        }

        // Make a copy, in case callbacks are removed while iterating
        const array = Array.from(this.map.get(type));

        for (let i = 0, l = array.length; i < l; i++) {
            array[i].call(this, ...event);
        }
    }

    destroy() {
        this.map.clear();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
