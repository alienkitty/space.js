/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#simple_implementation_of_eventtarget
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js
 * Based on https://github.com/brunosimon/folio-2019/blob/master/src/javascript/Utils/EventEmitter.js
 */

/**
 * A simple implementation of EventTarget with event parameter spread.
 */
export class EventEmitter {
    constructor() {
        this.callbacks = {};
    }

    on(type, callback) {
        if (!this.callbacks[type]) {
            this.callbacks[type] = [];
        }

        this.callbacks[type].push(callback);
    }

    off(type, callback) {
        if (!this.callbacks[type]) {
            return;
        }

        if (callback) {
            const index = this.callbacks[type].indexOf(callback);

            if (~index) {
                this.callbacks[type].splice(index, 1);
            }
        } else {
            delete this.callbacks[type];
        }
    }

    emit(type, ...event) {
        if (!this.callbacks[type]) {
            return;
        }

        const stack = Array.from(this.callbacks[type]);

        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, ...event);
        }
    }

    destroy() {
        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
