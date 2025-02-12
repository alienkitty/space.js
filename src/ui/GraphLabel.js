/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

import { defer } from '../tween/Tween.js';

export class GraphLabel extends Interface {
    constructor({
        name
    }) {
        super('.label');

        this.name = name;

        this.width = 0;

        this.init();
    }

    async init() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translate(-50%, -50%)',
            fontSize: 'const(--ui-secondary-font-size)',
            letterSpacing: 'const(--ui-secondary-letter-spacing)',
            color: 'var(--ui-secondary-color)',
            whiteSpace: 'nowrap',
            opacity: 0
        });
        this.html(this.name);

        await defer();

        this.width = this.element.getBoundingClientRect().width;
    }
}
