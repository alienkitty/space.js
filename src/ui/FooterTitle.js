/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class FooterTitle extends Interface {
    constructor({
        link,
        target,
        callback,
        ...data
    }) {
        super('.title');

        this.link = link;
        this.target = target;
        this.callback = callback;
        this.data = data;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            cssFloat: 'right',
            padding: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'auto'
        });

        if (this.link || this.callback) {
            this.css({ cursor: 'pointer' });
        }

        if (this.data.name) {
            this.name = new Interface('.name');
            this.name.html(this.data.name);
            this.add(this.name);
        }

        if (this.data.caption) {
            this.caption = new Interface('.caption');
            this.caption.css({
                color: 'var(--ui-secondary-color)'
            });
            this.caption.html(this.data.caption);
            this.add(this.caption);
        }
    }

    addListeners() {
        if (this.link || this.callback) {
            this.element.addEventListener('mouseenter', this.onHover);
            this.element.addEventListener('mouseleave', this.onHover);
            this.element.addEventListener('click', this.onClick);
        }
    }

    removeListeners() {
        if (this.link || this.callback) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            this.element.removeEventListener('click', this.onClick);
        }
    }

    // Event handlers

    onHover = e => {
        this.events.emit('hover', e, { target: this });
    };

    onClick = e => {
        if (this.link) {
            open(this.link, this.target);
        }

        if (this.callback) {
            this.callback(this);
        }

        this.events.emit('click', e, { target: this });
    };

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        this.removeListeners();

        if (this.name !== undefined) {
            this.name.html(data.name);
        }

        if (this.caption !== undefined) {
            this.caption.html(data.caption);
        }

        this.link = data.link;
        this.target = data.target;
        this.callback = data.callback;

        if (this.link || this.callback) {
            this.css({ cursor: 'pointer' });
        } else {
            this.css({ cursor: '' });
        }

        this.addListeners();
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
