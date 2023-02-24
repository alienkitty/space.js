/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Interface } from '../utils/Interface.js';

export class Link extends Interface {
    constructor({
        value = '',
        callback
    }) {
        super('.link');

        this.value = value;
        this.callback = callback;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: 'fit-content',
            height: 20,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
        });
        this.text(this.value);

        this.line = new Interface('.line');
        this.line.css({
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 1,
            height: 1,
            backgroundColor: 'var(--ui-color)',
            transformOrigin: 'left center',
            scaleX: 0
        });
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.clearTween();

        if (type === 'mouseenter') {
            this.line.css({ transformOrigin: 'left center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');
        } else {
            this.line.css({ transformOrigin: 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');
        }
    };

    onClick = () => {
        const value = this.value;

        this.events.emit('update', value);

        if (this.callback) {
            this.callback(value);
        }
    };

    /**
     * Public methods
     */

    setValue = value => {
        this.value = value;

        this.element.childNodes[0].nodeValue = this.value;

        return this;
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
