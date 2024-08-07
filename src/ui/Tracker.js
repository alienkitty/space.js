/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';

import { clearTween, delayedCall } from '../tween/Tween.js';

export class Tracker extends Interface {
    constructor() {
        super('.tracker');

        this.position = new Vector2();
        this.locked = false;
        this.animatedIn = false;
        this.isInstanced = false;
        this.isVisible = false;

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.corners = new Interface('.corners');
        this.corners.invisible();
        this.corners.css({
            position: 'absolute',
            width: '100%',
            height: '100%'
        });
        this.add(this.corners);

        this.tl = new Interface('.tl');
        this.tl.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 6,
            height: 6,
            borderLeft: '1.5px solid var(--ui-color)',
            borderTop: '1.5px solid var(--ui-color)'
        });
        this.corners.add(this.tl);

        this.tr = new Interface('.tr');
        this.tr.css({
            position: 'absolute',
            top: 0,
            right: 0,
            width: 6,
            height: 6,
            borderTop: '1.5px solid var(--ui-color)',
            borderRight: '1.5px solid var(--ui-color)'
        });
        this.corners.add(this.tr);

        this.br = new Interface('.br');
        this.br.css({
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 6,
            height: 6,
            borderRight: '1.5px solid var(--ui-color)',
            borderBottom: '1.5px solid var(--ui-color)'
        });
        this.corners.add(this.br);

        this.bl = new Interface('.bl');
        this.bl.css({
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 6,
            height: 6,
            borderLeft: '1.5px solid var(--ui-color)',
            borderBottom: '1.5px solid var(--ui-color)'
        });
        this.corners.add(this.bl);
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
        this.css({ left: this.position.x, top: this.position.y });
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
        clearTween(this.timeout);

        this.corners.clearTween().tween({ scale: 1, opacity: 1 }, 400, 'easeOutCubic');

        this.animatedIn = true;
    }

    hide(fast) {
        if (this.locked) {
            return;
        }

        clearTween(this.timeout);

        this.timeout = delayedCall(fast ? 0 : 2000, () => {
            this.corners.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
        });

        this.animatedIn = false;
    }

    animateIn(isInstanced) {
        this.isInstanced = isInstanced;

        clearTween(this.timeout);

        if (!this.isInstanced) {
            this.corners.clearTween();
            this.corners.visible();
            this.corners.css({ scale: 0.25, opacity: 0 }).tween({ scale: 1, opacity: 1 }, 400, 'easeOutCubic');
        }

        this.animatedIn = true;
        this.isVisible = true;
    }

    animateOut(callback) {
        clearTween(this.timeout);

        this.corners.clearTween().tween({ scale: 0, opacity: 0 }, 500, 'easeInCubic', () => {
            this.corners.invisible();

            this.animatedIn = false;
            this.isVisible = false;

            if (callback) {
                callback();
            }
        });
    }
}
