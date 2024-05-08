/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

import { shuffle } from '../utils/Utils.js';

export class DetailsTitle extends Interface {
    constructor(title) {
        super('.title', 'h1');

        this.title = title;

        this.letters = [];

        this.init();
        this.initText();
    }

    init() {
        this.css({
            width: 'fit-content'
        });
    }

    initText() {
        const split = this.title.split('');

        split.forEach(string => {
            if (string === ' ') {
                string = '&nbsp';
            }

            const letter = new Interface(null, 'span');
            letter.css({ display: 'inline-block' });
            letter.html(string);
            this.add(letter);

            this.letters.push(letter);
        });
    }

    // Public methods

    setTitle(title) {
        this.title = title;
        this.letters = [];

        this.empty();
        this.initText();
        this.animateIn();
    }

    animateIn() {
        shuffle(this.letters);

        const underscores = this.letters.filter(letter => letter === '_');

        underscores.forEach((letter, i) => {
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', i * 15);
        });

        const letters = this.letters.filter(letter => letter !== '_').slice(0, 2);

        letters.forEach((letter, i) => {
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        });
    }
}
