/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class DetailsLink extends Interface {
    constructor(title, link) {
        super('.link', 'a');

        this.title = title;
        this.link = link;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            width: 'fit-content',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto'
        });
        this.attr({ href: this.link });

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

    onHover = ({ type }) => {
        this.line.clearTween().tween({ x: type === 'mouseenter' ? 10 : 0 }, 200, 'easeOutCubic');
    };

    onClick = e => {
        this.events.emit('click', e, { target: this });
    };

    // Public methods

    setLink(link) {
        this.link = link;

        this.attr({ href: this.link });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
