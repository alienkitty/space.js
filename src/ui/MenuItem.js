/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class MenuItem extends Interface {
    constructor({
        name,
        index
    }) {
        super('.item');

        this.name = name;
        this.index = index;

        this.active = false;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            padding: 10,
            textAlign: 'center',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
        this.text(this.name);

        this.line = new Interface('.line');
        this.line.css({
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
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

    // Event handlers

    onHover = ({ type }) => {
        if (this.active) {
            return;
        }

        this.clearTween();

        if (type === 'mouseenter') {
            this.tween({ opacity: 1 }, 200, 'easeOutSine');
        } else {
            this.tween({ opacity: 0.5 }, 400, 'easeOutSine');
        }
    };

    onClick = () => {
        if (this.active) {
            return;
        }

        this.events.emit('click', { target: this });
    };

    // Public methods

    setTitle = title => {
        this.title = title;

        this.element.childNodes[0].nodeValue = this.title;
    };

    activate = direction => {
        this.active = true;

        this.line.css({ transformOrigin: direction < 0 ? 'left center' : 'right center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');

        this.tween({ opacity: 1 }, 300, 'easeOutSine');
    };

    deactivate = direction => {
        this.active = false;

        this.line.css({ transformOrigin: direction < 0 ? 'left center' : 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');

        this.tween({ opacity: 0.5 }, 500, 'easeOutSine');
    };

    animateIn = delay => {
        this.clearTween();
        this.css({ y: 10, opacity: 0 }).tween({ y: 0, opacity: this.active ? 1 : 0.5 }, 700, 'easeOutCubic', delay, () => {
            this.css({ pointerEvents: 'auto' });
        });
    };

    animateOut = delay => {
        this.clearTween();
        this.css({ pointerEvents: 'none' });
        this.tween({ y: -5, opacity: 0 }, 700, 'easeOutCubic', delay);
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
