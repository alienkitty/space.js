/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';
import { DetailsLink } from './DetailsLink.js';

export class Details extends Interface {
    constructor(data, {
        breakpoint = 1000
    } = {}) {
        super('.details');

        this.data = data;
        this.breakpoint = breakpoint;

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
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

        this.bg = new Interface('.bg');
        this.bg.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: 0
        });
        this.add(this.bg);

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
        this.content.html(this.data.content);
        this.container.add(this.content);

        this.data.links.forEach(data => {
            const link = new DetailsLink(data.title, data.link);
            link.css({
                display: 'block',
                width: 'fit-content'
            });
            this.container.add(link);
        });
    }

    addListeners() {
        window.addEventListener('resize', this.onResize);
        this.bg.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        window.removeEventListener('resize', this.onResize);
        this.bg.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onResize = () => {
        if (document.documentElement.clientWidth < this.breakpoint) {
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
    };

    onClick = () => {
        this.events.emit('click');
    };

    // Public methods

    animateIn = () => {
        this.clearTween();
        this.visible();
        this.css({
            pointerEvents: 'auto',
            opacity: 1
        });

        const duration = 2000;
        const stagger = 175;

        this.bg.clearTween().tween({ opacity: 0.35 }, duration, 'easeOutSine');

        this.container.children.forEach((child, i) => {
            const delay = i === 0 ? 0 : duration;

            child.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();
    };

    animateOut = () => {
        this.css({ pointerEvents: 'none' });

        this.bg.clearTween().tween({ opacity: 0 }, 1000, 'easeOutSine');

        this.clearTween().tween({ opacity: 0 }, 1800, 'easeOutExpo', () => {
            this.invisible();
        });
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
