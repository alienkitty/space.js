/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { ReticleInfo } from './ReticleInfo.js';

import { TwoPI } from '../utils/Utils.js';

export class ReticleCanvas extends Interface {
    constructor() {
        super('.reticle');

        const size = 10;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;

        this.position = new Vector2();
        this.target = new Vector2();
        this.lerpSpeed = 1;
        this.animatedIn = false;
        this.needsUpdate = true;

        this.init();
        this.initCanvas();

        this.resize();
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

        this.center = new Interface(null, 'canvas');
        this.center.css({
            position: 'absolute'
        });
        this.add(this.center);
    }

    initCanvas() {
        this.context = this.center.element.getContext('2d');
    }

    // Public methods

    setData(data) {
        if (!this.info) {
            this.info = new ReticleInfo();
            this.add(this.info);
        }

        this.info.setData(data);
    }

    resize() {
        const dpr = 2; // Always 2

        this.center.element.width = Math.round(this.width * dpr);
        this.center.element.height = Math.round(this.height * dpr);
        this.center.element.style.width = `${this.width}px`;
        this.center.element.style.height = `${this.height}px`;
        this.context.scale(dpr, dpr);

        // Context properties need to be reassigned after resize
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

        this.update();
    }

    update() {
        this.position.lerp(this.target, this.lerpSpeed);

        this.css({ left: Math.round(this.position.x), top: Math.round(this.position.y) });

        if (this.needsUpdate) {
            this.context.clearRect(0, 0, this.center.element.width, this.center.element.height);
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, TwoPI);
            this.context.stroke();
        }
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
}
