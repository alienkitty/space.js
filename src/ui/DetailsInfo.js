/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';

export class DetailsInfo extends Interface {
    constructor(data) {
        super('.details');

        this.data = data;

        this.init();
        this.initViews();
    }

    init() {
        this.invisible();
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            x: -10,
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            margin: '10% 10% 6%'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.data.title);
        this.title.css({
            width: 'fit-content',
            pointerEvents: 'auto'
        });
        this.container.add(this.title);

        this.info = new Interface('.info', 'p');
        this.info.css({
            width: 'fit-content',
            pointerEvents: 'auto',
            textTransform: 'uppercase'
        });
        this.info.html(this.data.content);
        this.container.add(this.info);
    }

    // Public methods

    setContent(content) {
        this.info.html(content);
    }

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.container.css({ margin: '0 20px 24px' });
        } else {
            this.container.css({ margin: '10% 10% 6%' });
        }
    }

    animateIn() {
        this.clearTween();
        this.visible();
        this.css({ opacity: 1 });

        const duration = 2000;
        const stagger = 175;

        this.container.children.forEach((child, i) => {
            const delay = i === 0 ? 0 : 200;

            child.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();

        this.css({ x: -10, opacity: 0 }).tween({ x: 0, opacity: 1 }, duration, 'easeOutCubic');
    }

    animateOut(callback) {
        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    }
}
