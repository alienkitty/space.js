/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { NavLink } from './NavLink.js';
import { HeaderInfo } from './HeaderInfo.js';

export class Header extends Interface {
    constructor({
        fps = false,
        ...data
    }) {
        super('.header');

        this.fps = fps;
        this.data = data;

        this.init();
        this.initViews();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 20,
            top: 20,
            right: 20
        });
    }

    initViews() {
        if (Array.isArray(this.data.links)) {
            this.data.links.forEach(data => {
                const link = new NavLink(data.title, data.link);
                link.css({
                    x: -10,
                    opacity: 0
                });
                this.add(link);
            });
        }

        if (this.fps) {
            this.info = new HeaderInfo();
            this.info.css({
                x: -10,
                opacity: 0
            });
            this.add(this.info);
        }
    }

    // Public methods

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.css({
                left: 10,
                top: 10,
                right: 10
            });
        } else {
            this.css({
                left: 20,
                top: 20,
                right: 20
            });
        }
    }

    animateIn() {
        const duration = 1000;
        const stagger = 200;

        this.children.forEach((child, i) => {
            child.clearTween().tween({ x: 0, opacity: 1 }, duration, 'easeOutQuart', i * stagger);
        });
    }

    animateOut() {
        this.children.forEach(child => {
            child.clearTween().tween({ opacity: 0 }, 500, 'easeInCubic');
        });
    }
}
