/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class InputTotal extends Interface {
    constructor({
        maxlength
    }) {
        super('.total');

        this.maxlength = maxlength;

        this.length = 0;
        this.animatedIn = false;

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 15,
            opacity: 0
        });

        this.info = new Interface('.info');
        this.info.css({
            fontSize: 'var(--ui-secondary-font-size)',
            letterSpacing: 'var(--ui-secondary-letter-spacing)',
            opacity: 0.9
        });
        this.info.text(`${this.length}/${this.maxlength}`);
        this.add(this.info);
    }

    // Public methods

    setValue(value) {
        this.length = value.length;

        this.info.text(`${this.length}/${this.maxlength}`);
    }

    animateIn() {
        if (this.animatedIn) {
            return;
        }

        this.animatedIn = true;

        this.clearTween().css({ y: 10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 500, 'easeOutCubic');
    }

    animateOut() {
        this.animatedIn = false;

        this.clearTween().tween({ opacity: 0 }, 200, 'easeInOutSine');
    }
}
