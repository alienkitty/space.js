/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { HeaderInfo } from './HeaderInfo.js';
import { NavTitle } from './NavTitle.js';
import { NavLink } from './NavLink.js';

export class Header extends Interface {
    constructor({
        fps = false,
        fpsOpen = false,
        ...data
    }) {
        super('.header');

        this.fps = fps;
        this.fpsOpen = fpsOpen;
        this.data = data;

        this.links = [];

        this.init();
        this.initViews();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 20,
            top: 20,
            right: 20
        });
    }

    initViews() {
        const fps = this.fps;
        const fpsOpen = this.fpsOpen;

        if (this.data.title) {
            this.title = new NavTitle(this.data.title);
            this.title.css({
                x: -10,
                opacity: 0
            });
            this.add(this.title);
        }

        if (Array.isArray(this.data.links)) {
            this.data.links.forEach(data => {
                const link = new NavLink(data);
                link.css({
                    x: -10,
                    opacity: 0
                });
                this.add(link);
                this.links.push(link);
            });
        }

        if (fps || fpsOpen) {
            this.info = new HeaderInfo({ fpsOpen });
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
            child.clearTween().css({ x: -10, opacity: 0 }).tween({ x: 0, opacity: 1 }, duration, 'easeOutQuart', i * stagger);
        });

        if (this.fpsOpen) {
            this.info.animateIn();
        }
    }

    animateOut() {
        this.children.forEach(child => {
            child.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
        });
    }
}
