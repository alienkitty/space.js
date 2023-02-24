import { Interface, basename } from 'space.js/three';

import { Config } from '../../config/Config.js';
import { Styles } from '../../config/Styles.js';
import { DetailsTitle } from './DetailsTitle.js';
import { DetailsLink } from './DetailsLink.js';

export class Details extends Interface {
    constructor() {
        super('.details');

        this.texts = [];

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
            zIndex: 1,
            opacity: 0
        });
        this.add(this.bg);

        this.container = new Interface('.container');
        this.container.css({
            width: 400,
            margin: '10% 10% 13%',
            zIndex: 1
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(basename('Multiuser Fluid').replace(/[\s.]+/g, '_'));
        this.container.add(this.title);
        this.texts.push(this.title);

        this.text = new Interface('.text', 'p');
        this.text.css({
            ...Styles.content
        });
        this.text.html('A fluid shader tribute to Mr.doob’s Multiuser Sketchpad from 2010. Multiuser Fluid is an experiment to combine UI and data visualization elements in a multiuser environment.');
        this.container.add(this.text);
        this.texts.push(this.text);

        const items = [
            {
                title: 'Source code',
                link: 'https://glitch.com/edit/#!/multiuser-fluid'
            },
            {
                title: 'Mr.doob’s Multiuser Sketchpad',
                link: 'https://glitch.com/edit/#!/multiuser-sketchpad'
            },
            {
                title: 'David A Roberts’ Single-pass Fluid Solver',
                link: 'https://www.shadertoy.com/view/XlsBDf'
            }
        ];

        items.forEach(data => {
            const link = new DetailsLink(data.title, data.link);
            link.css({
                display: 'block',
                width: 'fit-content'
            });
            this.container.add(link);
            this.texts.push(link);
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

    /**
     * Event handlers
     */

    onResize = () => {
        if (document.documentElement.clientWidth < Config.BREAKPOINT) {
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

    /**
     * Public methods
     */

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

        this.texts.forEach((text, i) => {
            const delay = i === 0 ? 0 : duration;

            text.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
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
