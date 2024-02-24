/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class ListSelect extends Interface {
    constructor({
        list,
        index
    }) {
        super('.list-select');

        this.list = list;
        this.index = index;

        this.active = false;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            height: 20,
            lineHeight: 20,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            cursor: 'pointer'
        });

        this.content = new Interface('.content');
        this.content.css({
            position: 'absolute',
            width: '100%',
            height: '100%'
        });
        this.content.text(this.list[this.index]);
        this.add(this.content);

        this.over = new Interface('.over');
        this.over.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0
        });
        this.over.text(this.list[this.getNextIndex()]);
        this.add(this.over);
    }

    getNextIndex() {
        this.next = this.index + 1;

        if (this.next >= this.list.length) {
            this.next = 0;
        }

        return this.next;
    }

    addListeners() {
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onClick = () => {
        if (this.active) {
            return;
        }

        this.active = true;

        this.index = this.next;

        this.content.tween({ y: -8, opacity: 0 }, 100, 'easeOutCubic');
        this.over.css({ y: 8, opacity: 0 }).tween({ y: 0, opacity: 1 }, 175, 'easeOutCubic', 50, () => {
            this.content.text(this.list[this.index]);
            this.content.css({ y: 0, opacity: 1 });
            this.over.css({ y: 8, opacity: 0 });
            this.over.text(this.list[this.getNextIndex()]);

            this.active = false;
        });

        this.events.emit('click', { target: this });
    };

    // Public methods

    setIndex(index) {
        this.index = index;

        this.content.text(this.list[this.index]);
        this.over.text(this.list[this.getNextIndex()]);
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
