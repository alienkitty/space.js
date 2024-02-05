/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class Instructions extends Interface {
    constructor(data) {
        super('.instructions');

        this.data = data;

        this.initHTML();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'absolute',
            left: '50%',
            bottom: 55,
            width: 300,
            marginLeft: -300 / 2,
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'absolute',
            bottom: 0,
            width: '100%'
        });
        this.add(this.container);

        this.content = new Interface('.content');
        this.content.css({
            textAlign: 'center',
            textTransform: 'uppercase',
            opacity: 0.7
        });
        this.content.html(this.data.content);
        this.container.add(this.content);
    }

    // Public methods

    animateIn = delay => {
        this.visible();
        this.tween({ opacity: 1 }, 800, 'easeInOutSine', delay);
        this.content.css({ y: 10 }).tween({ y: 0 }, 1200, 'easeOutCubic', delay);
    };

    animateOut = () => {
        this.tween({ opacity: 0 }, 300, 'easeOutSine', () => {
            this.invisible();
        });
    };
}
