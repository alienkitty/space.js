/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { DetailsTitle } from './DetailsTitle.js';
import { DetailsLink } from './DetailsLink.js';
import { DividerLine } from './DividerLine.js';
import { Graph } from './Graph.js';
import { GraphSegments } from './GraphSegments.js';
import { Meter } from './Meter.js';

export class Details extends Interface {
    constructor(data) {
        super('.details');

        this.data = data;

        this.width = data.width || '100vw';
        this.content = [];
        this.links = [];
        this.animatedIn = false;

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.invisible();
        this.css({
            position: 'relative',
            width: this.width,
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

        if (this.data.dividerLine) {
            this.dividerLine = new DividerLine();
            this.dividerLine.setLeft(this.width);
            this.add(this.dividerLine);
        }

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            padding: `10vw calc(${this.width} - 10vw - 440px) 13vw 10vw`,
            pointerEvents: 'auto'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.data.title);
        this.container.add(this.title);

        if (this.data.content) {
            if (!Array.isArray(this.data.content)) {
                this.data.content = [this.data.content];
            }

            this.data.content.forEach(data => {
                this.addContent(this.container, data);
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

    addContent(target, data) {
        if (typeof data === 'object') {
            if (data.group !== undefined) {
                const container = new Interface('.content');
                container.css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: data.width
                });

                data.group.forEach(data => {
                    this.addContent(container, data);
                });

                target.add(container);
            } else {
                const container = new Interface('.content');
                container.css({
                    flexGrow: 1,
                    width: data.width,
                    marginRight: 20
                });

                if (data.title !== undefined) {
                    const info = new Interface('.info', 'h2');
                    info.css({
                        width: 'fit-content'
                    });
                    info.html(data.title);
                    container.add(info);
                }

                if (data.content !== undefined) {
                    const content = new Interface('.content');
                    content.css({
                        width: 'fit-content'
                    });
                    content.html(data.content);
                    container.add(content);
                }

                if (data.graph !== undefined) {
                    if (data.graph.segments) {
                        const graph = new GraphSegments(data.graph);
                        graph.animateIn(true);
                        container.add(graph);
                    } else {
                        const graph = new Graph(data.graph);
                        graph.animateIn(true);
                        container.add(graph);
                    }
                }

                if (data.meter !== undefined) {
                    const meter = new Meter(data.meter);
                    meter.animateIn(true);
                    container.add(meter);
                }

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

                target.add(container);
                this.content.push(container);
            }
        } else {
            const content = new Interface('.content');
            content.css({
                width: 'fit-content'
            });
            content.html(data);
            target.add(content);
            this.content.push(content);
        }
    }

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.container.css({
                padding: '80px 20px 60px'
            });

            if (this.dividerLine) {
                this.dividerLine.setLeft('100vw');
            }
        } else {
            this.container.css({
                padding: `10vw calc(${this.width} - 10vw - 440px) 13vw 10vw`
            });

            if (this.dividerLine) {
                this.dividerLine.setLeft(this.width);
            }
        }
    }

    animateIn() {
        this.clearTween();
        this.visible();
        this.css({ opacity: 1 });

        const duration = 2000;
        const stagger = 175;

        if (this.bg) {
            this.bg.clearTween().css({ opacity: 0 }).tween({ opacity: 0.35 }, duration, 'easeOutSine');
        }

        if (this.dividerLine) {
            this.dividerLine.animateIn();
        }

        this.container.children.forEach((child, i) => {
            const delay = i === 0 ? 0 : 200;

            child.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();

        this.animatedIn = true;
    }

    animateOut(callback) {
        this.clearTween();

        if (this.dividerLine) {
            this.dividerLine.animateOut();
        }

        this.tween({ opacity: 0 }, 400, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });

        this.animatedIn = false;
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
