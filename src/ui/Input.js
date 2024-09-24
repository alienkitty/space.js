/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { InputField } from './InputField.js';

export class Input extends Interface {
    constructor(data) {
        super('.input');

        this.data = data;

        this.isComplete = false;

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.invisible();
        this.css({
            height: 19,
            zIndex: 99999,
            opacity: 0
        });
    }

    initViews() {
        this.input = new InputField(this.data);
        this.add(this.input);
    }

    addListeners() {
        this.input.events.on('hover', this.onHover);
        this.input.events.on('complete', this.onComplete);
    }

    removeListeners() {
        this.input.events.off('hover', this.onHover);
        this.input.events.off('complete', this.onComplete);
    }

    // Event handlers

    onHover = ({ type }) => {
        if (type === 'mouseenter') {
            this.input.tween({ opacity: 1 }, 200, 'easeOutSine');
        } else {
            this.input.tween({ opacity: 0.7 }, 200, 'easeOutSine');
        }
    };

    onComplete = () => {
        this.isComplete = true;

        this.events.emit('complete');
    };

    // Public methods

    focus() {
        this.input.focus();
    }

    blur() {
        this.input.blur();
    }

    animateIn() {
        this.visible();

        return this.tween({ opacity: 1 }, 400, 'easeOutCubic', () => {
            this.input.css({ pointerEvents: 'auto' });
        });
    }

    animateOut() {
        this.input.css({ pointerEvents: 'none' });

        return this.tween({ opacity: 0 }, 600, 'easeInOutSine', () => {
            this.invisible();
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
