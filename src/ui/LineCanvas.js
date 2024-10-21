/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Stage } from '../utils/Stage.js';
import { Component } from '../utils/Component.js';

import { clearTween, tween } from '../tween/Tween.js';

export class LineCanvas extends Component {
    constructor(context) {
        super();

        this.context = context;

        this.start = new Vector2();
        this.end = new Vector2();

        this.props = {
            alpha: 0,
            start: 0,
            progress: 0
        };

        this.theme();
    }

    // Public methods

    setStartPoint(position) {
        this.start.copy(position);
    }

    setEndPoint(position) {
        this.end.copy(position);
    }

    theme() {
        this.lineWidth = 1.5;
        this.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-line').trim();
    }

    update() {
        if (this.props.alpha <= 0) {
            return;
        }

        if (this.props.alpha < 0.001) {
            this.context.globalAlpha = 0;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        const length = this.start.distanceTo(this.end);
        const dash = length * this.props.progress;
        const gap = length - dash;
        const offset = -length * this.props.start;

        this.context.save();

        this.context.setLineDash([dash, gap]);
        this.context.lineDashOffset = offset;
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.strokeStyle;

        this.context.beginPath();
        this.context.moveTo(this.start.x, this.start.y);
        this.context.lineTo(this.end.x, this.end.y);
        this.context.stroke();

        this.context.restore();
    }

    animateIn(reverse) {
        clearTween(this.props);

        this.props.alpha = 0;

        tween(this.props, { alpha: 1 }, 500, 'easeOutSine');

        if (reverse) {
            this.props.start = 1;
            this.props.progress = 0;

            tween(this.props, { start: 0 }, 500, 'easeInCubic', null, () => {
                this.props.progress = 1 - this.props.start;
            });
        } else {
            this.props.start = 0;
            this.props.progress = 0;

            tween(this.props, { progress: 1 }, 400, 'easeOutCubic');
        }
    }

    animateOut(fast, callback) {
        let duration;
        let ease;

        if (fast) {
            duration = 400;
            ease = 'easeOutCubic';
        } else {
            duration = 500;
            ease = 'easeInCubic';
        }

        clearTween(this.props);

        tween(this.props, { start: 1 }, duration, ease, () => {
            this.props.alpha = 0;
            this.props.start = 0;

            if (callback) {
                callback();
            }
        }, () => {
            this.props.progress = 1 - this.props.start;
        });
    }

    deactivate() {
        clearTween(this.props);
        tween(this.props, { alpha: 0 }, 300, 'easeOutSine');
    }
}
