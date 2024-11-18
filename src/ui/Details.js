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

        this.content = [];
        this.links = [];

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.invisible();
        this.css({
            position: 'relative',
            pointerEvents: 'none',
            opacity: 0
        });

        if (this.data.background) {
            this.bg = new Interface('.bg');
            this.bg.css({
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--bg-color)'
            });
            this.add(this.bg);
        }

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '10vw calc(100vw - 10vw - 440px) 13vw 10vw'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.data.title);
        this.container.add(this.title);

        if (!Array.isArray(this.data.content)) {
            this.data.content = [this.data.content];
        }

        this.data.content.forEach(data => {
            if (typeof data === 'object') {
                const container = new Interface('.content');
                container.css({
                    flexGrow: 1,
                    width: data.width,
                    marginRight: 20
                });

                if (data.title) {
                    const info = new Interface('.info', 'h2');
                    info.css({
                        width: 'fit-content'
                    });
                    info.html(data.title);
                    container.add(info);
                }

                const content = new Interface('.content');
                content.css({
                    width: 'fit-content'
                });
                content.html(data.content);
                container.add(content);

                if (Array.isArray(data.links)) {
                    data.links.forEach(data => {
                        const link = new DetailsLink(data.title, data.link);
                        link.css({
                            display: 'block'
                        });
                        container.add(link);
                        this.links.push(link);
                    });
                }

                this.container.add(container);
                this.content.push(container);
            } else {
                const content = new Interface('.content');
                content.css({
                    width: 'fit-content'
                });
                content.html(data);
                this.container.add(content);
                this.content.push(content);
            }
        });

        if (Array.isArray(this.data.links)) {
            this.data.links.forEach(data => {
                const link = new DetailsLink(data.title, data.link);
                link.css({
                    display: 'block'
                });
                this.container.add(link);
                this.links.push(link);
            });
        }
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

    setContent(content, index = 0) {
        this.content[index].html(content);
    }

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.container.css({
                padding: '80px 20px 60px'
            });
        } else {
            this.container.css({
                padding: '10vw calc(100vw - 10vw - 440px) 13vw 10vw'
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
            this.bg.clearTween().css({ opacity: 0 }).tween({ opacity: 0.35 }, duration, 'easeOutSine');
        }

        this.container.children.forEach((child, i) => {
            const delay = i === 0 ? 0 : 200;

            child.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();
    }

    animateOut(callback) {
        this.clearTween();
        this.css({ pointerEvents: 'none' });

        this.tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
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
