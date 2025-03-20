/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class DividerLine extends Interface {
    constructor() {
        super('.divider-line');

        this.init();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });

        this.top = new Interface('.line');
        this.top.css({
            position: 'absolute',
            left: 'max(50vw, 250px)',
            top: 20,
            width: 1,
            height: 92,
            backgroundColor: 'var(--ui-color-divider-line)',
            transformOrigin: 'center top',
            scaleY: 0
        });
        this.add(this.top);

        this.bottom = new Interface('.line');
        this.bottom.css({
            position: 'absolute',
            left: 'max(50vw, 250px)',
            bottom: 20,
            width: 1,
            height: 92,
            backgroundColor: 'var(--ui-color-divider-line)',
            transformOrigin: 'center bottom',
            scaleY: 0
        });
        this.add(this.bottom);
    }

    // Public methods

    setLeft(left) {
        this.top.css({ left });
        this.bottom.css({ left });
    }

    animateIn() {
        this.top.clearTween().tween({ scaleY: 1 }, 800, 'easeOutQuint');
        this.bottom.clearTween().tween({ scaleY: 1 }, 800, 'easeOutQuint');
    }

    animateOut() {
        this.top.clearTween().tween({ scaleY: 0 }, 500, 'easeOutQuint');
        this.bottom.clearTween().tween({ scaleY: 0 }, 500, 'easeOutQuint');
    }
}
