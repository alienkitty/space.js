/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

import { shuffle } from '../utils/Utils.js';

export class Title extends Interface {
    constructor(title) {
        super('.title', 'h1');

        this.title = title;

        this.letters = [];

        this.init();
        this.initText();
    }

    init() {
        this.invisible();
        this.css({
            width: 'fit-content',
            opacity: 0
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

    setTitle(title, direction = 1) {
        this.title = title;
        this.letters = [];

        this.clearTween().tween({ y: -10 * direction, opacity: 0 }, 300, 'easeInSine', () => {
            this.empty();
            this.initText();
            this.animateIn();
            this.css({ y: 10 * direction }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    }

    animateIn() {
        this.clearTween();
        this.visible();

        shuffle(this.letters);

        const letters = this.letters.filter(letter => letter.text() !== '_').slice(0, 2);

        letters.forEach((letter, i) => {
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        });

        this.tween({ opacity: 1 }, 1000, 'easeOutSine');
    }

    animateOut(callback) {
        this.clearTween().tween({ opacity: 0 }, 300, 'easeInSine', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    }
}
