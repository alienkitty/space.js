/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Link extends Interface {
    constructor({
        title,
        link,
        target = '_blank'
    }) {
        super('.link', 'a');

        this.title = title;
        this.link = link;
        this.target = target;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            padding: 10,
            textTransform: 'uppercase',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
        this.attr({
            href: this.link,
            target: this.target
        });
        this.text(this.title);

        this.line = new Interface('.line');
        this.line.css({
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            height: window.devicePixelRatio > 1 ? 1.5 : 1,
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

    onHover = e => {
        this.line.clearTween();

        if (e.type === 'mouseenter') {
            this.line.css({ transformOrigin: 'left center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');
        } else {
            this.line.css({ transformOrigin: 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');
        }

        this.events.emit('hover', e, { target: this });
    };

    onClick = e => {
        this.events.emit('click', e, { target: this });
    };

    // Public methods

    setTitle(title) {
        this.title = title;

        this.element.childNodes[0].nodeValue = this.title;
    }

    setLink(link) {
        this.link = link;

        this.attr({ href: this.link });
    }

    setTarget(target) {
        this.target = target;

        this.attr({ target: this.target });
    }

    animateIn() {
        this.clearTween().tween({ opacity: 1 }, 400, 'easeOutCubic');
    }

    animateOut() {
        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
