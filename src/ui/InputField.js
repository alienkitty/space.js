/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class InputField extends Interface {
    constructor({
        placeholder = '',
        maxlength = '',
        forceFocus = false
    }) {
        super('.field');

        this.placeholder = placeholder;
        this.maxlength = maxlength;
        this.forceFocus = forceFocus;

        this.lastValue = '';
        this.isFocused = false;

        this.init();
        this.setAttributes();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            height: 19,
            pointerEvents: 'none',
            opacity: 0.7
        });

        this.input = new Interface(null, 'input');
        this.input.css({
            width: '100%',
            height: 19,
            backgroundColor: 'transparent',
            lineHeight: 'normal',
            color: 'var(--ui-color)',
            resize: 'none'
        });
        this.add(this.input);
    }

    setAttributes() {
        this.input.element.setAttribute('autocomplete', 'off');
        this.input.element.setAttribute('autocapitalize', 'off');
        this.input.element.setAttribute('autocorrect', 'off');
        this.input.element.setAttribute('spellcheck', 'false');
        this.input.element.setAttribute('placeholder', this.placeholder);
        this.input.element.setAttribute('maxlength', this.maxlength);
    }

    addListeners() {
        this.input.element.addEventListener('focus', this.onFocus);
        this.input.element.addEventListener('blur', this.onBlur);
        this.input.element.addEventListener('keydown', this.onKeyDown);
        this.input.element.addEventListener('keyup', this.onKeyUp);
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);

        if (this.forceFocus) {
            window.addEventListener('keypress', this.onForceFocus);
        }
    }

    removeListeners() {
        this.input.element.removeEventListener('focus', this.onFocus);
        this.input.element.removeEventListener('blur', this.onBlur);
        this.input.element.removeEventListener('keydown', this.onKeyDown);
        this.input.element.removeEventListener('keyup', this.onKeyUp);
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);

        if (this.forceFocus) {
            window.removeEventListener('keypress', this.onForceFocus);
        }
    }

    // Event handlers

    onFocus = () => {
        this.onHover({ type: 'mouseenter' });

        this.isFocused = true;
    };

    onBlur = () => {
        this.isFocused = false;

        this.onHover({ type: 'mouseleave' });
    };

    onKeyDown = e => {
        if (e.keyCode === 13) { // Enter
            e.preventDefault();
        }
    };

    onKeyUp = e => {
        if (e.keyCode === 13) { // Enter
            this.events.emit('complete');
        }

        const value = this.input.element.value;

        if (value !== this.lastValue) {
            this.lastValue = value;

            this.events.emit('typing', { text: value });
        }
    };

    onHover = e => {
        if (this.isFocused) {
            return;
        }

        this.events.emit('hover', e);
    };

    onForceFocus = () => {
        if (this.isFocused) {
            return;
        }

        this.focus();
    };

    // Public methods

    setValue(value) {
        this.input.element.value = value;
        this.lastValue = value;
    }

    focus() {
        this.input.element.focus();
        this.onFocus();
    }

    blur() {
        this.input.element.blur();
        this.onBlur();
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
