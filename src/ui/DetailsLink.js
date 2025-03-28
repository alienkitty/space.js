/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class DetailsLink extends Interface {
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
            width: 'fit-content',
            whiteSpace: 'nowrap'
        });
        this.attr({
            href: this.link,
            target: this.target
        });

        this.content = new Interface('.content');
        this.content.css({
            display: 'inline-block'
        });
        this.content.text(this.title);
        this.add(this.content);

        this.line = new Interface('.line');
        this.line.css({
            display: 'inline-block'
        });
        this.line.html('&nbsp;&nbsp;―');
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
        this.line.clearTween().tween({ x: e.type === 'mouseenter' ? 10 : 0 }, 200, 'easeOutCubic');

        this.events.emit('hover', e, { target: this });
    };

    onClick = e => {
        this.events.emit('click', e, { target: this });
    };

    // Public methods

    setTitle(title) {
        this.title = title;

        this.content.text(this.title);
    }

    setLink(link) {
        this.link = link;

        this.attr({ href: this.link });
    }

    setTarget(target) {
        this.target = target;

        this.attr({ target: this.target });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
