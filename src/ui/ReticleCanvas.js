/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Stage } from '../utils/Stage.js';
import { Component } from '../utils/Component.js';

import { clearTween, tween } from '../tween/Tween.js';
import { TwoPI } from '../utils/Utils.js';

export class ReticleCanvas extends Component {
    constructor(context) {
        super();

        this.context = context;

        const size = 10;

        this.radius = size * 0.4;

        this.position = new Vector2();
        this.target = new Vector2();
        this.lerpSpeed = 1;

        this.lineWidth = 1.5;
        this.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

        this.props = {
            scale: 1,
            alpha: 0
        };
    }

    // Public methods

    update() {
        this.position.lerp(this.target, this.lerpSpeed);

        if (this.props.alpha <= 0) {
            return;
        }

        if (this.props.alpha < 0.001) {
            this.context.globalAlpha = 0;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        this.context.save();
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
    }

    animateOut(callback) {
        clearTween(this.props);

        tween(this.props, { scale: 0, alpha: 0 }, 500, 'easeInCubic', callback);
    }
}
