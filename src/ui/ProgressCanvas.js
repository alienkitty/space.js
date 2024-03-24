/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, tween } from '../tween/Tween.js';
import { degToRad } from '../utils/Utils.js';

export class ProgressCanvas extends Interface {
    constructor() {
        super(null, 'canvas');

        const size = 32;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.startAngle = degToRad(-90);
        this.progress = 0;
        this.needsUpdate = false;

        this.initCanvas();
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
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

    resize() {
        const dpr = 2; // Always 2

        this.element.width = Math.round(this.width * dpr);
        this.element.height = Math.round(this.height * dpr);
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        // Context properties need to be reassigned after resize
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

        this.update();
    }

    update() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, this.startAngle, this.startAngle + degToRad(360 * this.progress));
        this.context.stroke();
    }

    animateIn() {
        this.addListeners();
        this.resize();
    }

    animateOut() {
        this.tween({ scale: 1.1, opacity: 0 }, 400, 'easeInCubic');
    }

    destroy() {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    }
}
