/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Content extends Interface {
    constructor({
        callback
    }) {
        super('.content');

        this.callback = callback;

        this.update();
    }

    // Event handlers

    onUpdate = e => {
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

    update() {
        this.events.emit('update', { target: this });

        if (this.callback) {
            this.callback(undefined, this);
        }
    }
}
