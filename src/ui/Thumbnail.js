/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Thumbnail extends Interface {
    constructor(data) {
        super('.thumbnail');

        if (data.image) {
            this.image = data.image;
            this.width = data.width;
            this.height = data.height;
            this.noCanvas = data.noCanvas;
            this.callback = data.callback;
        } else {
            this.image = data;
            this.width = 150;
            this.height = 100;
        }

        this.init();

        if (!this.noCanvas) {
            this.initCanvas();
        }

        this.addListeners();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 20,
            top: 20,
            boxSizing: 'border-box',
            width: this.width,
            height: this.height,
            border: '1px solid var(--ui-color-divider-line)',
            cursor: 'pointer',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });

        if (this.noCanvas) {
            this.thumbnail = new Interface(null);
            this.add(this.thumbnail);
        }
    }

    initCanvas() {
        this.thumbnail = new Interface(null, 'canvas');
        this.add(this.thumbnail);

        this.context = this.thumbnail.element.getContext('2d');
    }

    addListeners() {
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onClick = () => {
        console.log('onClick');
    };

    // Public methods

    setThumbnail(image) {
        this.image = image;

        if (this.noCanvas) {
            const oldThumbnail = this.thumbnail;

            const newThumbnail = this.thumbnail.clone();
            newThumbnail.add(this.value);

            this.replace(oldThumbnail, newThumbnail);
            this.thumbnail = newThumbnail;

            oldThumbnail.destroy();
        } else {
            this.update();
        }

        this.events.emit('update', { image: this.image, target: this });

        if (this.callback) {
            this.callback(this.image, this);
        }
    }

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.css({
                left: 10,
                top: 10
            });
        } else {
            this.css({
                left: 20,
                top: 20
            });
        }

        if (this.context) {
            this.thumbnail.element.width = Math.round(this.width * dpr);
            this.thumbnail.element.height = Math.round(this.height * dpr);
            this.thumbnail.element.style.width = `${this.width}px`;
            this.thumbnail.element.style.height = `${this.height}px`;

            this.update();
        }
    }

    update() {
        if (!this.noCanvas) {
            // Draws from a canvas are faster
            this.context.drawImage(this.image, 0, 0, this.thumbnail.element.width, this.thumbnail.element.height);
        }
    }

    animateIn(delay) {
        this.clearTween();
        this.css({ opacity: 0 }).tween({ opacity: 1 }, 700, 'easeOutCubic', delay, () => {
            this.css({ pointerEvents: 'auto' });
        });
    }

    animateOut(delay) {
        this.clearTween();
        this.css({ pointerEvents: 'none' });
        this.tween({ opacity: 0 }, 700, 'easeOutCubic', delay);
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
