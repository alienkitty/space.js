/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { clearTween, tween } from '../tween/Tween.js';

export class DetailsButton extends Interface {
    constructor() {
        super('.button');

        const size = 20;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.hoverRadius = size * 0.3;
        this.openRadius = size * 0.2;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.isOpen = false;
        this.animatedIn = false;
        this.hoveredIn = false;
        this.needsUpdate = false;

        this.props = {
            radius: this.radius
        };

        this.init();
        this.initCanvas();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width + 40,
            height: this.height + 20,
            cursor: 'pointer',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
    }

    initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            position: 'absolute',
            left: 10,
            top: 10
        });
        this.context = this.canvas.element.getContext('2d');
        this.add(this.canvas);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            return;
        }

        clearTween(this.props);

        this.needsUpdate = true;

        if (this.isOpen) {
            if (type === 'mouseenter') {
                this.hoveredIn = true;

                tween(this.props, { radius: this.hoverRadius }, 275, 'easeInOutCubic', () => {
                    this.needsUpdate = false;
                });
            } else {
                this.hoveredIn = false;

                tween(this.props, { radius: this.openRadius }, 275, 'easeInOutCubic', () => {
                    this.needsUpdate = false;
                });
            }
        } else {
            if (type === 'mouseenter') {
                this.hoveredIn = true;

                const start = () => {
                    tween(this.props, { radius: this.hoverRadius }, 800, 'easeOutQuart', () => {
                        tween(this.props, { radius: this.radius, spring: 1, damping: 0.5 }, 800, 'easeOutElastic', 500, () => {
                            if (this.hoveredIn) {
                                start();
                            } else {
                                this.needsUpdate = false;
                            }
                        });
                    });
                };

                start();
            } else {
                this.hoveredIn = false;

                tween(this.props, { radius: this.radius, spring: 1, damping: 0.5 }, 800, 'easeOutElastic', 200, () => {
                    this.needsUpdate = false;
                });
            }
        }
    };

    onClick = () => {
        this.events.emit('click', { target: this });
    };

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        if (!this.number) {
            this.number = new Interface('.number');
            this.number.css({
                position: 'absolute',
                left: 34,
                top: 12,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 'var(--ui-title-letter-spacing)'
            });
            this.number.text(data.count);
            this.add(this.number);
        }

        if (String(data.count) === this.number.text()) {
            return;
        }

        this.number.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
            this.number.text(data.count);
            this.number.css({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    }

    resize() {
        const dpr = 2; // Always 2

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        this.canvas.element.style.width = `${this.width}px`;
        this.canvas.element.style.height = `${this.height}px`;
        this.context.scale(dpr, dpr);

        // Context properties need to be reassigned after resize
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

        this.update();
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.props.radius, this.startAngle, this.endAngle);
        this.context.stroke();
    }

    animateIn() {
        clearTween(this.props);

        this.props.radius = 0;

        this.animatedIn = false;
        this.needsUpdate = true;

        tween(this.props, { radius: this.isOpen ? this.openRadius : this.radius }, 1000, 'easeOutExpo', () => {
            this.needsUpdate = false;
            this.animatedIn = true;
        });

        this.clearTween().tween({ opacity: 1 }, 400, 'easeOutCubic');
    }

    animateOut() {
        this.animatedIn = false;

        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
    }

    open() {
        this.isOpen = true;

        clearTween(this.props);

        this.needsUpdate = true;

        tween(this.props, { radius: this.openRadius }, 400, 'easeOutCubic', () => {
            this.needsUpdate = false;
        });
    }

    close() {
        this.isOpen = false;

        clearTween(this.props);

        this.needsUpdate = true;

        tween(this.props, { radius: this.radius }, 400, 'easeOutCubic', () => {
            this.needsUpdate = false;
        });
    }

    destroy() {
        this.removeListeners();

        clearTween(this.props);

        return super.destroy();
    }
}
