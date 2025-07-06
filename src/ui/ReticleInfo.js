/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class ReticleInfo extends Interface {
    constructor() {
        super('.info');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: 15,
            marginTop: -9
        });

        this.primary = new Interface('.primary');
        this.primary.css({
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 'var(--ui-title-line-height)',
            letterSpacing: 'var(--ui-number-letter-spacing)',
            whiteSpace: 'nowrap'
        });
        this.add(this.primary);

        this.secondary = new Interface('.secondary');
        this.secondary.css({
            fontSize: 'var(--ui-secondary-font-size)',
            letterSpacing: 'var(--ui-secondary-letter-spacing)',
            color: 'var(--ui-secondary-color)'
        });
        this.add(this.secondary);
    }

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        if (data.primary) {
            this.primary.html(data.primary);
        }

        if (data.secondary) {
            this.secondary.html(data.secondary);
        }
    }

    animateIn() {
        this.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic', 200);
    }

    animateOut() {
        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
    }
}
