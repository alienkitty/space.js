/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { InputField } from './InputField.js';
import { InputTotal } from './InputTotal.js';

export class Input extends Interface {
    constructor({
        noTotal = false,
        ...data
    } = {}) {
        super('.input');

        this.noTotal = noTotal;
        this.data = data;

        this.isComplete = false;

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.invisible();
        this.css({
            height: this.data.maxlength ? 45 : 20,
            zIndex: 99999,
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
    }

    initViews() {
        this.input = new InputField(this.data);
        this.add(this.input);

        if (this.data.maxlength && !this.noTotal) {
            this.total = new InputTotal(this.data);
            this.add(this.total);
        }
    }

    addListeners() {
        this.input.events.on('hover', this.onHover);
        this.input.events.on('click', this.onClick);
        this.input.events.on('typing', this.onTyping);
        this.input.events.on('complete', this.onComplete);
    }

    removeListeners() {
        this.input.events.off('hover', this.onHover);
        this.input.events.off('click', this.onClick);
        this.input.events.off('typing', this.onTyping);
        this.input.events.off('complete', this.onComplete);
    }

    // Event handlers

    onHover = e => {
        if (e.type === 'mouseenter') {
            this.input.tween({ opacity: 1 }, 200, 'easeOutSine');

            if (this.total) {
                this.total.animateIn();
            }
        } else {
            this.input.tween({ opacity: 0.7 }, 200, 'easeOutSine');

            if (this.total) {
                this.total.animateOut();
            }
        }

        this.events.emit('hover', e, { target: this });
    };

    onClick = e => {
        this.events.emit('click', e, { target: this });
    };

    onTyping = ({ text }) => {
        if (this.total) {
            this.total.setValue(text);
        }

        this.events.emit('update', { value: text, target: this });
    };

    onComplete = () => {
        this.isComplete = true;

        this.events.emit('complete', { target: this });
    };

    // Public methods

    setValue(value) {
        this.input.setValue(value);

        if (this.total) {
            this.total.setValue(value);
        }
    }

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
