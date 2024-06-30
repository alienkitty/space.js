/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { Panel } from '../panels/Panel.js';

export class HeaderInfo extends Interface {
    constructor({
        fpsOpen = false
    }) {
        super('.info');

        this.fpsOpen = fpsOpen;

        this.time = 0;
        this.count = 0;
        this.prev = 0;
        this.fps = 0;

        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.openColor = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.css({
            cssFloat: 'right',
            padding: 10,
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.number = new Interface('.number');
        this.number.css({
            letterSpacing: 1
        });
        this.number.text(this.fps);
        this.add(this.number);
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        window.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        window.removeEventListener('pointerdown', this.onPointerDown);
    }

    // Event handlers

    onColorPicker = ({ open, target }) => {
        if (!this.openColor && !this.element.contains(target.element)) {
            return;
        }

        if (open) {
            this.disable();

            this.openColor = target;
        } else {
            this.enable();

            this.openColor = null;
        }
    };

    onHover = ({ type }) => {
        if (this.isOpen) {
            return;
        }

        if (type === 'mouseenter') {
            this.animateIn();
        }
    };

    onPointerDown = e => {
        this.lastTime = performance.now();
        this.lastMouse.set(e.clientX, e.clientY);

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
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointermove', this.onPointerMove);

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        if (this.openColor && !this.openColor.element.contains(e.target)) {
            Stage.events.emit('color_picker', { open: false, target: this });
        } else if (this.atPoint(this.mouse)) {
            if (this.isOpen) {
                this.animateOut();
            } else {
                this.animateIn();
            }
        } else if (!this.element.contains(e.target)) {
            this.animateOut();
        }
    };

    // Public methods

    addPanel(item) {
        if (!this.panel) {
            this.panel = new Panel();
            this.panel.css({
                position: 'absolute',
                top: 0,
                right: 10
            });
            this.add(this.panel);

            this.addListeners();
        }

        this.panel.add(item);
    }

    update() {
        this.time = performance.now();

        if (this.time - 1000 > this.prev) {
            this.fps = Math.round(this.count * 1000 / (this.time - this.prev));
            this.prev = this.time;
            this.count = 0;
        }

        this.count++;

        this.number.text(this.fps);
    }

    animateIn() {
        if (!this.panel) {
            return;
        }

        this.css({ pointerEvents: 'none' });

        this.panel.animateIn();

        this.isOpen = true;
    }

    animateOut() {
        if (!this.panel || this.fpsOpen) {
            return;
        }

        this.panel.animateOut(() => {
            this.css({ pointerEvents: 'auto' });

            this.isOpen = false;
        });
    }

    enable() {
        this.number.tween({ opacity: 1 }, 400, 'easeInOutSine');
    }

    disable() {
        this.number.tween({ opacity: 0.35 }, 400, 'easeInOutSine');
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
