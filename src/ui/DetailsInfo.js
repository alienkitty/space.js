/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';

export class DetailsInfo extends Interface {
    constructor(data) {
        super('.details');

        this.data = data;

        this.animatedIn = false;

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
            padding: '10% 10% 6%',
            pointerEvents: 'auto'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.data.title);
        this.container.add(this.title);

        if (this.data.content) {
            this.info = new Interface('.info', 'p');
            this.info.css({
                width: 'fit-content',
                textTransform: 'uppercase'
            });
            this.info.html(this.data.content);
            this.container.add(this.info);
        }
    }

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        this.data = data;

        this.container.empty();
        this.initViews();
    }

    setContent(content) {
        this.info.html(content);
    }

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            if (this.data.detailsButton) {
                this.container.css({
                    padding: '0 20px 60px'
                });
            } else {
                this.container.css({
                    padding: '0 20px 24px'
                });
            }
        } else {
            this.container.css({
                padding: '10% 10% 6%'
            });
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

        this.animatedIn = true;
    }

    animateOut(callback) {
        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });

        this.animatedIn = false;
    }
}
