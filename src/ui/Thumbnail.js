/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export class Thumbnail extends Interface {
    constructor(data) {
        super('.thumbnail');

        const defaults = {
            width: 150,
            height: 100,
            snapMargin: 20
        };

        if (data.image) {
            data = Object.assign(defaults, data);
            this.image = data.image;
            this.width = data.width;
            this.height = data.height;
            this.snapMargin = data.snapMargin;
            this.noCanvas = data.noCanvas;
            this.callback = data.callback;
        } else {
            this.image = data;
            this.width = defaults.width;
            this.height = defaults.height;
            this.snapMargin = defaults.snapMargin;
        }

        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();
        this.snapPosition = new Vector2();
        this.snapTarget = new Vector2();
        this.windowSnapMargin = this.snapMargin;
        this.isMove = false;

        this.init();

        if (!this.noCanvas) {
            this.initCanvas();
        }

        this.addListeners();
    }

    init() {
        this.css({
            position: 'absolute',
            left: this.snapMargin,
            top: this.snapMargin,
            boxSizing: 'border-box',
            width: this.width,
            height: this.height,
            border: '1px solid var(--ui-color-divider-line)',
            cursor: 'move',
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
        this.element.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        this.element.removeEventListener('pointerdown', this.onPointerDown);
    }

    // Event handlers

    onPointerDown = e => {
        this.bounds = this.element.getBoundingClientRect();
        this.lastTime = performance.now();
        this.lastMouse.set(e.clientX, e.clientY);
        this.lastOrigin.copy(this.bounds);

        this.onPointerMove(e);

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    };

    onPointerMove = ({ clientX, clientY }) => {
        const event = {
            x: clientX,
            y: clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);

        if (this.delta.length()) {
            this.origin.addVectors(this.lastOrigin, this.delta);

            this.bounds = this.element.getBoundingClientRect();
            this.snap();
        }
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointermove', this.onPointerMove);

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

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
        if (!this.isMove) {
            if (width < breakpoint) {
                this.windowSnapMargin = this.snapMargin - 10;
            } else {
                this.windowSnapMargin = this.snapMargin;
            }

            this.css({
                left: this.windowSnapMargin,
                top: this.windowSnapMargin
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

    snap() {
        let snapped = false;

        this.snapPosition.copy(this.origin);
        this.snapTarget.copy(this.snapPosition);

        // Top
        if (this.snapTarget.y <= this.windowSnapMargin + 10) {
            this.snapTarget.y = this.windowSnapMargin;
            snapped = true;
        }

        // Right
        if (this.snapTarget.x >= window.innerWidth - this.bounds.width - this.windowSnapMargin - 10) {
            this.snapTarget.x = window.innerWidth - this.bounds.width - this.windowSnapMargin;
            snapped = true;
        }

        // Bottom
        if (this.snapTarget.y >= window.innerHeight - this.bounds.height - this.windowSnapMargin - 10) {
            this.snapTarget.y = window.innerHeight - this.bounds.height - this.windowSnapMargin;
            snapped = true;
        }

        // Left
        if (this.snapTarget.x <= this.windowSnapMargin + 10) {
            this.snapTarget.x = this.windowSnapMargin;
            snapped = true;
        }

        this.snapPosition.sub(this.snapTarget);
        this.origin.sub(this.snapPosition); // Subtract delta

        this.css({ left: Math.round(this.origin.x), top: Math.round(this.origin.y) });

        this.isMove = !snapped;
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
