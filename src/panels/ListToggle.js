/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class ListToggle extends Interface {
    constructor({
        name,
        index
    }) {
        super('.list-toggle');

        this.name = name;
        this.index = index;

        this.active = false;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            cssFloat: 'left',
            width: 'calc(var(--ui-panel-width) / 2)',
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
            height: '100%',
            opacity: 0.35
        });
        this.content.text(this.name);
        this.add(this.content);

        this.over = new Interface('.over');
        this.over.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0
        });
        this.over.text(this.name);
        this.add(this.over);
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
        if (this.active) {
            return;
        }

        this.content.clearTween();
        this.over.clearTween();

        if (type === 'mouseenter') {
            this.content.tween({ y: -8, opacity: 0 }, 100, 'easeOutCubic');
            this.over.css({ y: 8, opacity: 0 }).tween({ y: 0, opacity: 1 }, 175, 'easeOutCubic', 50);
        } else {
            this.content.tween({ y: 0, opacity: 0.35 }, 300, 'easeOutCubic', 50);
            this.over.tween({ y: 8, opacity: 0 }, 175, 'easeOutCubic');
        }
    };

    onClick = () => {
        if (this.active) {
            return;
        }

        this.events.emit('click', { target: this });
    };

    // Public methods

    activate() {
        this.active = true;

        this.content.css({ y: -8, opacity: 0 });
        this.over.css({ y: 0, opacity: 1 });
    }

    deactivate() {
        this.active = false;

        this.onHover({ type: 'mouseleave' });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
