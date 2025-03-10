/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Stage } from '../utils/Stage.js';
import { Component } from '../utils/Component.js';

import { clearTween, tween } from '../tween/Tween.js';
import { TwoPI } from '../utils/Utils.js';

export class ReticleCanvas extends Component {
    constructor({
        context
    } = {}) {
        super();

        this.context = context;

        this.radius = 4;
        this.position = new Vector2();
        this.animatedIn = false;

        this.props = {
            scale: 1,
            alpha: 0
        };

        this.theme();
    }

    // Public methods

    setContext(context) {
        this.context = context;
    }

    theme() {
        this.lineWidth = 1.5;
        this.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();
    }

    update() {
        if (this.props.alpha <= 0) {
            return;
        }

        this.context.save();

        if (this.props.alpha < 0.001) {
            this.context.globalAlpha = 0;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        this.context.translate(this.position.x, this.position.y);
        this.context.scale(this.props.scale, this.props.scale);

        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.strokeStyle;

        this.context.beginPath();
        this.context.arc(0, 0, this.radius, 0, TwoPI);
        this.context.stroke();

        this.context.restore();
    }

    animateIn() {
        clearTween(this.props);

        this.props.scale = 0.25;
        this.props.alpha = 0;

        tween(this.props, { scale: 1, alpha: 1 }, 400, 'easeOutCubic');

        this.animatedIn = true;
    }

    animateOut(callback) {
        clearTween(this.props);

        tween(this.props, { scale: 0, alpha: 0 }, 500, 'easeInCubic', () => {
            this.animatedIn = false;

            if (callback) {
                callback();
            }
        });
    }

    destroy() {
        clearTween(this.props);

        return super.destroy();
    }
}
