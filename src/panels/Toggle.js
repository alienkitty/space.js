/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Toggle extends Interface {
    constructor({
        name,
        value = false,
        callback
    }) {
        super('.toggle');

        this.name = name;
        this.value = value;
        this.callback = callback;

        this.init();
        this.setValue(this.value);

        this.addListeners();
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            height: 20,
            cursor: 'pointer'
        });
        this.add(this.container);

        this.content = new Interface('.content');
        this.content.css({
            cssFloat: 'left',
            marginRight: 10,
            lineHeight: 20,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
        });
        this.content.text(this.name);
        this.container.add(this.content);

        this.circle = new Interface('.circle');
        this.circle.css({
            cssFloat: 'right',
            marginTop: -1,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 20,
            letterSpacing: 'var(--ui-number-letter-spacing)',
            opacity: this.value ? 1 : 0.15
        });
        this.circle.text('●');
        this.container.add(this.circle);
    }

    addListeners() {
        this.container.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.container.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onClick = () => {
        this.value = !this.value;

        this.update();
    };

    // Public methods

    hasContent() {
        return !!this.group;
    }

    setContent(content) {
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

    setValue(value, notify = true) {
        this.value = value;

        this.update(notify);
    }

    update(notify = true) {
        this.circle.clearTween().tween({ opacity: this.value ? 1 : 0.15 }, 200, 'easeOutCubic');

        if (notify) {
            this.events.emit('update', { path: [], value: this.value, target: this });

            if (this.callback) {
                this.callback(this.value, this);
            }
        }
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
