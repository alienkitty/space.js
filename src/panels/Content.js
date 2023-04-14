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

    /**
     * Public methods
     */

    setContent = content => {
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
    };

    update = () => {
        this.events.emit('update', undefined, this);

        if (this.callback) {
            this.callback(undefined, this);
        }
    };
}
