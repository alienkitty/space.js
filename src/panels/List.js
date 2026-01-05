/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { ListToggle } from './ListToggle.js';
import { ListSelect } from './ListSelect.js';

export class List extends Interface {
    constructor({
        name,
        list,
        value,
        callback
    }) {
        super('.list');

        this.name = name;
        this.list = list;
        this.keys = Array.from(this.list.keys());
        this.values = Array.from(this.list.values());
        this.index = this.keys.indexOf(value);
        this.callback = callback;

        this.items = [];

        this.init();
        this.initViews();

        this.setIndex(this.index);
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            height: 20
        });
        this.add(this.container);
    }

    initViews() {
        if (this.keys.length > 2) {
            const item = new ListSelect({ list: this.keys, index: this.index });
            item.events.on('click', this.onClick);
            this.container.add(item);
            this.items.push(item);
        } else {
            this.keys.forEach((name, index) => {
                const item = new ListToggle({ name, index });
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

    // Event handlers

    onClick = ({ target }) => {
        this.index = target.index;

        this.update();
    };

    onUpdate = e => {
        e.path.unshift([this.name, this.index]);

        this.events.emit('update', e);
    };

    // Public methods

    hasContent() {
        return !!this.group;
    }

    setContent(content) {
        content.events.on('update', this.onUpdate);

        if (!this.group) {
            this.group = new Interface('.group');
            this.group.css({
                position: 'relative'
            });
            this.add(this.group);
        }

        const oldGroup = this.group;

        const newGroup = this.group.clone();
        newGroup.add(content);

        this.replace(oldGroup, newGroup);
        this.group = newGroup;

        oldGroup.destroy();
    }

    toggleContent(show) {
        if (show) {
            this.group.show();
        } else {
            this.group.hide();
        }
    }

    setList(list) {
        this.list = list;
        this.keys = Array.from(this.list.keys());
        this.values = Array.from(this.list.values());

        if (this.keys.length > 2) {
            this.items[0].setList(this.keys);
        } else {
            this.items.forEach((item, index) => {
                item.setName(this.keys[index]);
            });
        }
    }

    setIndex(index, notify = true) {
        this.index = index;

        if (this.keys.length > 2) {
            this.items[0].setIndex(this.index);
        }

        this.update(notify);
    }

    setValue(value, notify = true) {
        this.index = this.values.indexOf(value);

        if (this.keys.length > 2) {
            this.items[0].setIndex(this.index);
        }

        this.update(notify);
    }

    update(notify = true) {
        if (notify) {
            const value = this.keys[this.index];

            this.events.emit('update', { path: [], index: this.index, target: this });

            if (this.callback) {
                this.callback(value, this);
            }
        }

        if (this.keys.length > 2) {
            return;
        }

        const target = this.items[this.index];

        if (target && !target.active) {
            target.activate();
        }

        this.items.forEach(item => {
            if (item !== target && item.active) {
                item.deactivate();
            }
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
