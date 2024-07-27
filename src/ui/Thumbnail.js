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
            snapMargin: 20,
            position: 'tl',
            noCanvas: false
        };

        if (data.image) {
            data = Object.assign(defaults, data);

            this.image = data.image;
            this.width = data.width;
            this.height = data.height;
            this.snapMargin = data.snapMargin;
            this.position = data.position;
            this.noCanvas = data.noCanvas;
            this.callback = data.callback;
        } else {
            this.image = data;
            this.width = defaults.width;
            this.height = defaults.height;
            this.snapMargin = defaults.snapMargin;
            this.position = defaults.position;
            this.noCanvas = defaults.noCanvas;
        }

        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();
        this.snapPosition = new Vector2();
        this.snapTarget = new Vector2();
        this.windowSnapMargin = this.snapMargin;
        this.snappedTop = this.position === 'tl' || this.position === 'tr';
        this.snappedRight = this.position === 'br' || this.position === 'tr';
        this.snappedBottom = this.position === 'bl' || this.position === 'br';
        this.snappedLeft = this.position === 'tl' || this.position === 'bl';
        this.snapped = this.snappedTop || this.snappedRight || this.snappedBottom || this.snappedLeft;

        this.init();

        if (!this.noCanvas) {
            this.initCanvas();
        }

        this.initDragAndDrop();
        this.setThumbnail(this.image, this.noCanvas);

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
    }

    initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        });
        this.add(this.canvas);

        this.context = this.canvas.element.getContext('2d');
    }

    initDragAndDrop() {
        this.reader = new FileReader();
    }

    addListeners() {
        this.element.addEventListener('pointerdown', this.onPointerDown);
        this.element.addEventListener('dragover', this.onDragOver);
        this.element.addEventListener('drop', this.onDrop);
        this.reader.addEventListener('load', this.onLoad);
    }

    removeListeners() {
        this.element.removeEventListener('pointerdown', this.onPointerDown);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('drop', this.onDrop);
        this.reader.removeEventListener('load', this.onLoad);
    }

    loadImage(path) {
        const image = new Image();

        image.onload = () => {
            this.setThumbnail(image, true);

            image.onload = null;
        };

        image.src = path;
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
            this.snap();
        }
    };

    onPointerUp = e => {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        this.events.emit('click', { target: this });
    };

    onDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    onDrop = e => {
        e.preventDefault();

        this.reader.readAsDataURL(e.dataTransfer.files[0]);
    };

    onLoad = e => {
        this.loadImage(e.target.result);
    };

    // Public methods

    setThumbnail(image, noCanvas) {
        this.image = image;

        if (noCanvas) {
            if (!this.wrapper) {
                this.wrapper = new Interface('.wrapper');
                this.add(this.wrapper);
            }

            const content = new Interface(this.image);
            content.css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            });

            const oldWrapper = this.wrapper;

            const newWrapper = this.wrapper.clone();
            newWrapper.add(content);

            this.replace(oldWrapper, newWrapper);
            this.wrapper = newWrapper;

            oldWrapper.destroy();

            if (this.canvas) {
                this.canvas = this.canvas.destroy();
                this.context = null;
            }
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
            this.windowSnapMargin = this.snapMargin - 10;
        } else {
            this.windowSnapMargin = this.snapMargin;
        }

        if (this.snapped) {
            if (this.snappedTop) {
                this.css({ top: this.windowSnapMargin });
            }

            if (this.snappedRight) {
                this.css({ left: width - this.width - this.windowSnapMargin });
            }

            if (this.snappedBottom) {
                this.css({ top: height - this.height - this.windowSnapMargin });
            }

            if (this.snappedLeft) {
                this.css({ left: this.windowSnapMargin });
            }
        }

        if (this.canvas) {
            this.canvas.element.width = Math.round(this.width * dpr);
            this.canvas.element.height = Math.round(this.height * dpr);

            this.update();
        }
    }

    update() {
        if (this.canvas && this.image) {
            // Draws from a canvas are faster
            this.context.drawImage(this.image, 0, 0, this.canvas.element.width, this.canvas.element.height);
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
        let snappedTop = false;
        let snappedRight = false;
        let snappedBottom = false;
        let snappedLeft = false;

        this.snapPosition.copy(this.origin);
        this.snapTarget.copy(this.snapPosition);

        // Top
        if (this.snapTarget.y <= this.windowSnapMargin + 10) {
            this.snapTarget.y = this.windowSnapMargin;
            snappedTop = true;
        }

        // Right
        if (this.snapTarget.x >= window.innerWidth - this.width - this.windowSnapMargin - 10) {
            this.snapTarget.x = window.innerWidth - this.width - this.windowSnapMargin;
            snappedRight = true;
        }

        // Bottom
        if (this.snapTarget.y >= window.innerHeight - this.height - this.windowSnapMargin - 10) {
            this.snapTarget.y = window.innerHeight - this.height - this.windowSnapMargin;
            snappedBottom = true;
        }

        // Left
        if (this.snapTarget.x <= this.windowSnapMargin + 10) {
            this.snapTarget.x = this.windowSnapMargin;
            snappedLeft = true;
        }

        this.snapPosition.sub(this.snapTarget);
        this.origin.sub(this.snapPosition); // Subtract delta

        this.css({ left: this.origin.x, top: this.origin.y });

        this.snappedTop = snappedTop;
        this.snappedRight = snappedRight;
        this.snappedBottom = snappedBottom;
        this.snappedLeft = snappedLeft;
        this.snapped = this.snappedTop || this.snappedRight || this.snappedBottom || this.snappedLeft;
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
