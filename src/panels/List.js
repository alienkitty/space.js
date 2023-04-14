/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { ListToggle } from './ListToggle.js';
import { ListSelect } from './ListSelect.js';

export class List extends Interface {
    constructor({
        list,
        index,
        callback
    }) {
        super('.list');

        this.list = list;
        this.index = index;
        this.callback = callback;

        this.items = [];

        this.initHTML();
        this.initViews();
        this.setIndex(this.index);
    }

    initHTML() {
        this.container = new Interface('.container');
        this.container.css({
            height: 18
        });
        this.add(this.container);
    }

    initViews() {
        if (this.list.length > 2) {
            const item = new ListSelect({ list: this.list, index: this.index });
            item.events.on('click', this.onClick);
            this.container.add(item);
            this.items.push(item);
        } else {
            this.list.forEach((label, index) => {
                const item = new ListToggle({ label, index });
                item.events.on('click', this.onClick);
                this.container.add(item);
                this.items.push(item);
            });
        }
    }

    removeListeners() {
        this.items.forEach(item => {
            item.events.off('click', this.onClick);
        });
    }

    /**
     * Event handlers
     */

    onClick = ({ target }) => {
        this.index = target.index;

        this.update();
    };

    /**
     * Public methods
     */

    setContent = content => {
        if (!this.group) {
            this.group = new Interface('.group');
            this.group.css({
                position: 'relative',
                left: -10
            });
            this.add(this.group);
        }

        const oldGroup = this.group;

        const newGroup = this.group.clone();
        newGroup.add(content);

        this.replace(oldGroup, newGroup);
        this.group = newGroup;

        oldGroup.destroy();
    };

    setIndex = index => {
        this.index = index;

        this.update();
    };

    update = () => {
        const value = this.list[this.index];

        this.events.emit('update', value, this);

        if (this.callback) {
            this.callback(value, this);
        }

        if (this.list.length > 2) {
            return;
        }

        const target = this.items[this.index];

        if (target && !target.clicked) {
            target.active();
        }

        this.items.forEach(item => {
            if (item !== target && item.clicked) {
                item.inactive();
            }
        });
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
