/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class HeaderTitle extends Interface {
    constructor({
        link,
        target,
        ...data
    }) {
        super('.title');

        this.link = link;
        this.target = target;
        this.data = data;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            cssFloat: 'left',
            padding: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'auto'
        });

        if (this.link) {
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
                opacity: 'var(--ui-secondary-opacity)'
            });
            this.caption.html(this.data.caption);
            this.add(this.caption);
        }
    }

    addListeners() {
        if (this.link) {
            this.element.addEventListener('click', this.onClick);
        }
    }

    removeListeners() {
        if (this.link) {
            this.element.removeEventListener('click', this.onClick);
        }
    }

    // Event handlers

    onClick = () => {
        open(this.link, this.target);

        this.events.emit('click', { target: this });
    };

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        if (this.name) {
            this.name.html(data.name);
        }

        if (this.caption) {
            this.caption.html(data.caption);
        }

        this.link = data.link;
        this.target = data.target;

        if (this.link) {
            this.css({ cursor: 'pointer' });
        } else {
            this.css({ cursor: '' });
        }
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
