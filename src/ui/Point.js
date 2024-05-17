/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { PointInfo } from './PointInfo.js';

export class Point extends Interface {
    constructor(ui, tracker) {
        super('.point');

        this.ui = ui;
        this.tracker = tracker;

        this.position = new Vector2();
        this.target = new Vector2();
        this.origin = new Vector2();
        this.originPosition = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();
        this.lerpSpeed = 0.07;
        this.openColor = null;
        this.isOpen = false;
        this.isMove = false;

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.invisible();
        this.css({
            position: 'absolute',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    initViews() {
        this.info = new PointInfo();
        this.add(this.info);
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
        this.info.container.element.addEventListener('mouseenter', this.onHover);
        this.info.container.element.addEventListener('mouseleave', this.onHover);
        window.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);
        this.info.container.element.removeEventListener('mouseenter', this.onHover);
        this.info.container.element.removeEventListener('mouseleave', this.onHover);
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
        if (!this.ui) {
            return;
        }

        if (type === 'mouseenter') {
            this.ui.onHover({ type: 'over', isPoint: true });
        } else {
            this.ui.onHover({ type: 'out', isPoint: true });
        }
    };

    onPointerDown = e => {
        if (!this.isOpen) {
            return;
        }

        if (this.info.container.element.contains(e.target)) {
            this.lastTime = performance.now();
            this.lastMouse.set(e.clientX, e.clientY);
            this.lastOrigin.copy(this.origin);

            this.onPointerMove(e);

            window.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp);
        }
    };

    onPointerMove = ({ clientX, clientY }) => {
        const event = {
            x: clientX,
            y: clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);
        this.origin.addVectors(this.lastOrigin, this.delta);
        this.originPosition.addVectors(this.origin, this.position);

        if (this.ui && this.ui.snap) {
            this.bounds = this.info.container.element.getBoundingClientRect();

            this.ui.snap();
        }

        this.css({ left: Math.round(this.originPosition.x), top: Math.round(this.originPosition.y) });

        this.isMove = true;
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointermove', this.onPointerMove);

        if (!this.isOpen) {
            return;
        }

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        if (this.openColor && !this.openColor.element.contains(e.target)) {
            Stage.events.emit('color_picker', { open: false, target: this });
        }

        if (this.tracker && this.tracker.isVisible && this.info.container.element.contains(e.target)) {
            if (!this.tracker.isInstanced && !this.tracker.animatedIn) {
                this.ui.show();
            } else if (!this.tracker.locked) {
                this.ui.lock();
            } else {
                this.ui.unlock();
                this.ui.hide();
            }
        }
    };

    // Public methods

    setData(data) {
        this.info.setData(data);
    }

    setTargetNumbers(targetNumbers) {
        this.info.setTargetNumbers(targetNumbers);
    }

    update() {
        if (this.isMove) {
            return;
        }

        this.position.lerp(this.target, this.lerpSpeed);

        this.css({ left: Math.round(this.position.x), top: Math.round(this.position.y) });
    }

    lock() {
        this.info.lock();
    }

    unlock() {
        this.info.unlock();
    }

    open() {
        this.info.open();

        this.bounds = this.info.container.element.getBoundingClientRect();

        this.isOpen = true;
    }

    close(fast) {
        this.info.close(fast);

        this.origin.set(0, 0);

        this.isOpen = false;
        this.isMove = false;
    }

    animateIn() {
        this.visible();
        this.clearTween().css({ opacity: 1 });
        this.info.animateIn();
    }

    animateOut() {
        this.info.animateOut(() => {
            this.invisible();
        });
    }

    enable() {
        this.info.container.tween({ opacity: 1 }, 400, 'easeInOutSine');
    }

    disable() {
        this.info.container.tween({ opacity: 0.35 }, 400, 'easeInOutSine');
    }

    activate() {
        this.clearTween().tween({ opacity: 1 }, 300, 'easeOutSine');
    }

    deactivate(toggle) {
        this.clearTween().tween({ opacity: 0 }, 300, 'easeOutSine', () => {
            this.enable();
            this.close(true);

            if (toggle) {
                this.activate();
            }
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
