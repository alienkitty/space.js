/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { ReticleInfo } from './ReticleInfo.js';

export class Reticle extends Interface {
    constructor() {
        super('.reticle');

        const size = 10;

        this.width = size;
        this.height = size;
        this.position = new Vector2();
        this.animatedIn = false;

        this.init();
    }

    init() {
        this.invisible();
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: this.width,
            height: this.height,
            marginLeft: -this.width / 2,
            marginTop: -this.height / 2,
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.center = new Interface('.center');
        this.center.css({
            position: 'absolute',
            boxSizing: 'border-box',
            left: '50%',
            top: '50%',
            width: this.width,
            height: this.height,
            marginLeft: -this.width / 2,
            marginTop: -this.height / 2,
            border: `${window.devicePixelRatio > 1 ? 1.5 : 1}px solid var(--ui-color)`,
            borderRadius: '50%'
        });
        this.add(this.center);
    }

    // Public methods

    setData(data) {
        if (!this.info) {
            this.info = new ReticleInfo();
            this.add(this.info);
        }

        this.info.setData(data);
    }

    update() {
        this.css({ left: this.position.x, top: this.position.y });
    }

    animateIn() {
        this.clearTween();
        this.visible();
        this.css({ scale: 0.25, opacity: 0 }).tween({ scale: 1, opacity: 1 }, 400, 'easeOutCubic');

        this.animatedIn = true;
    }

    animateOut(callback) {
        this.clearTween().tween({ scale: 0, opacity: 0 }, 500, 'easeInCubic', () => {
            this.invisible();

            this.animatedIn = false;

            if (callback) {
                callback();
            }
        });
    }

    activate() {
        this.clearTween().tween({ opacity: 1 }, 300, 'easeOutSine');
    }

    deactivate() {
        this.clearTween().tween({ opacity: 0 }, 300, 'easeOutSine');
    }
}
