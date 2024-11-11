/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Info extends Interface {
    constructor({
        bottom = false,
        ...data
    }) {
        super('.info');

        this.bottom = bottom;
        this.data = data;

        this.init();
    }

    init() {
        this.invisible();
        this.css({
            position: 'absolute',
            left: '50%',
            width: 300,
            marginLeft: -300 / 2,
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });

        if (this.bottom) {
            this.css({ bottom: 55 });
        } else {
            this.css({ top: 55 });
        }

        this.content = new Interface('.content');
        this.content.css({
            textAlign: 'center',
            textTransform: 'uppercase',
            opacity: 'var(--ui-info-opacity)'
        });
        this.content.html(this.data.content);
        this.add(this.content);
    }

    // Public methods

    setContent(content) {
        this.content.html(content);
    }

    animateIn(delay) {
        this.visible();
        this.tween({ opacity: 1 }, 800, 'easeInOutSine', delay);
        this.content.css({ y: 10 }).tween({ y: 0 }, 1200, 'easeOutCubic', delay);
    }

    animateOut(callback) {
        this.tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    }
}
