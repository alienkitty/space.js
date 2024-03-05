/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';
import { DetailsLink } from './DetailsLink.js';

export class Details extends Interface {
    constructor(data) {
        super('.details');

        this.data = data;

        this.links = [];

        this.init();
        this.initViews();

        this.addListeners();
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
            alignItems: 'center',
            pointerEvents: 'none',
            opacity: 0
        });

        if (this.data.background) {
            this.bg = new Interface('.bg');
            this.bg.css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                opacity: 0
            });
            this.add(this.bg);
        }

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            width: 400,
            margin: '10% 10% 13%'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.data.title);
        this.container.add(this.title);

        this.content = new Interface('.content', 'p');
        this.content.css({
            width: 'fit-content'
        });
        this.content.html(this.data.content);
        this.container.add(this.content);

        this.data.links.forEach(data => {
            const link = new DetailsLink(data.title, data.link);
            link.css({
                display: 'block'
            });
            this.container.add(link);
            this.links.push(link);
        });
    }

    addListeners() {
        if (this.bg) {
            this.bg.element.addEventListener('click', this.onClick);
        }
    }

    removeListeners() {
        if (this.bg) {
            this.bg.element.removeEventListener('click', this.onClick);
        }
    }

    // Event handlers

    onClick = () => {
        this.events.emit('click', { target: this });
    };

    // Public methods

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.css({ display: '' });

            this.container.css({
                width: '',
                margin: '80px 20px 40px'
            });
        } else {
            this.css({ display: 'flex' });

            this.container.css({
                width: 400,
                margin: '10% 10% 13%'
            });
        }
    }

    animateIn() {
        this.clearTween();
        this.visible();
        this.css({
            pointerEvents: 'auto',
            opacity: 1
        });

        const duration = 2000;
        const stagger = 175;

        if (this.bg) {
            this.bg.clearTween().tween({ opacity: 0.35 }, duration, 'easeOutSine');
        }

        this.container.children.forEach((child, i) => {
            const delay = i === 0 ? 0 : duration;

            child.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();
    }

    animateOut(callback) {
        this.css({ pointerEvents: 'none' });

        if (this.bg) {
            this.bg.clearTween().tween({ opacity: 0 }, 1000, 'easeOutSine');
        }

        this.clearTween().tween({ opacity: 0 }, 300, 'easeInSine', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
