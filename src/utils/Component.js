/**
 * @author pschroen / https://ufo.ai/
 */

import { EventEmitter } from './EventEmitter.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, tween } from '../tween/Tween.js';

/**
 * A base class for components with tween and destroy methods.
 */
export class Component {
    constructor() {
        this.events = new EventEmitter();
        this.children = [];
    }

    add(child) {
        if (!this.children) {
            return;
        }

        this.children.push(child);

        child.parent = this;

        return child;
    }

    remove(child) {
        if (!this.children) {
            return;
        }

        const index = this.children.indexOf(child);

        if (~index) {
            this.children.splice(index, 1);
        }
    }

    tween(props, duration, ease, delay, complete, update) {
        if (!ticker.isAnimating) {
            ticker.start();
        }

        return tween(this, props, duration, ease, delay, complete, update);
    }

    clearTween() {
        clearTween(this);

        return this;
    }

    destroy() {
        if (!this.children) {
            return;
        }

        if (this.parent && this.parent.remove) {
            this.parent.remove(this);
        }

        this.clearTween();

        this.events.destroy();

        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i] && this.children[i].destroy) {
                this.children[i].destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
