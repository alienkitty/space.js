/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';

import { clearTween, tween } from '../tween/Tween.js';

export class RadialGraphTracker extends Interface {
    constructor() {
        super('.tracker');

        this.position = new Vector2();
        this.origin = new Vector2();
        this.originPosition = new Vector2();
        this.graphHeight = 0;
        this.locked = false;
        this.animatedIn = false;
        this.isInstanced = true;
        this.isVisible = false;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    // Public methods

    setData(data) {
        if (!this.number) {
            this.number = new TargetNumber();
            this.number.css({
                left: -(this.number.width + 15),
                top: '50%',
                marginTop: -Math.round(this.number.height / 2)
            });
            this.add(this.number);
        }

        this.number.setData(data);
    }

    update() {
        this.originPosition.addVectors(this.origin, this.position);

        this.css({ left: this.originPosition.x, top: this.originPosition.y });
    }

    lock() {
        if (this.number) {
            this.number.animateIn();
        }

        this.locked = true;
    }

    unlock() {
        if (this.number) {
            this.number.animateOut();
        }

        this.locked = false;
    }

    show() {
        this.animatedIn = true;
    }

    hide() {
        if (this.locked) {
            return;
        }

        this.animatedIn = false;
    }

    open() {
        clearTween(this.origin);

        tween(this.origin, { x: this.graphHeight }, 400, 'easeOutCubic');

        this.isOpen = true;
    }

    close() {
        clearTween(this.origin);

        tween(this.origin, { x: 0 }, 400, 'easeOutCubic', 200);

        this.isOpen = false;
    }

    animateIn() {
        this.animatedIn = true;
        this.isVisible = true;
    }

    animateOut(callback) {
        this.animatedIn = false;
        this.isVisible = false;

        if (callback) {
            callback();
        }
    }
}
