/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, tween } from '../tween/Tween.js';

export class Progress extends Interface {
    constructor({
        size = 32
    } = {}) {
        super(null, 'svg');

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.startOffset = -0.25;
        this.progress = 0;
        this.needsUpdate = false;

        this.initSVG();

        this.addListeners();
    }

    initSVG() {
        this.attr({
            width: this.width,
            height: this.height
        });

        this.circle = new Interface(null, 'svg', 'circle');
        this.circle.attr({
            cx: this.x,
            cy: this.y,
            r: this.radius
        });
        this.circle.css({
            fill: 'none',
            stroke: 'var(--ui-color)',
            strokeWidth: 1.5
        });
        this.circle.start = 0;
        this.circle.offset = this.startOffset;
        this.circle.progress = 0;
        this.add(this.circle);
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    onUpdate = () => {
        if (this.needsUpdate) {
            this.update();
        }
    };

    onProgress = ({ progress }) => {
        clearTween(this);

        this.needsUpdate = true;

        tween(this, { progress }, 500, 'easeOutCubic', () => {
            this.needsUpdate = false;

            if (this.progress >= 1) {
                this.onComplete();
            }
        });
    };

    onComplete = () => {
        this.removeListeners();

        this.events.emit('complete');
    };

    // Public methods

    update() {
        this.circle.drawLine(this.progress);
    }

    animateIn() {
        this.clearTween().css({ scale: 1, opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic');
    }

    animateOut(callback) {
        this.clearTween().tween({ scale: 1.1, opacity: 0 }, 400, 'easeInCubic', callback);
    }

    destroy() {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    }
}
