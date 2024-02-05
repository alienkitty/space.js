/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { clearTween, tween } from '../tween/Tween.js';

export class MuteButton extends Interface {
    constructor(data) {
        super('.button');

        this.data = data;

        this.width = 24;
        this.height = 16;
        this.animatedIn = false;
        this.needsUpdate = false;

        this.props = {
            progress: 0,
            yMultiplier: this.data.sound ? 1 : 0
        };

        this.initHTML();
        this.initCanvas();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: this.width + 20,
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
            left: '50%',
            top: '50%',
            marginLeft: -this.width / 2,
            marginTop: -this.height / 2
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

        if (type === 'mouseenter') {
            tween(this.props, { yMultiplier: this.data.sound ? 0.7 : 0.3 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            tween(this.props, { yMultiplier: this.data.sound ? 1 : 0 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        }
    };

    onClick = () => {
        clearTween(this.props);

        if (this.data.sound) {
            this.data.sound = false;

            this.needsUpdate = true;

            tween(this.props, { yMultiplier: 0 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            this.data.sound = true;

            this.needsUpdate = true;

            tween(this.props, { yMultiplier: 1 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        }

        Stage.events.emit('sound', { sound: this.data.sound });

        localStorage.setItem('sound', JSON.stringify(this.data.sound));
    };

    // Public methods

    resize = () => {
        const dpr = 2; // Always 2

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        this.canvas.element.style.width = this.width + 'px';
        this.canvas.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        // Context properties need to be reassigned after resize
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

        this.update();
    };

    update = () => {
        const width = this.width + 1;
        const height = this.height / 2;
        const progress = width * this.props.progress;
        const increase = 90 / 180 * Math.PI / (height / 2);

        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);
        this.context.beginPath();

        let counter = 0;
        let x = 0;
        let y = height;

        for (let i = -4; i <= width; i++) {
            if (progress >= i) {
                this.context.moveTo(x, y);

                x = i;
                y = height - Math.sin(counter) * (height - 1) * this.props.yMultiplier;
                counter += increase;

                this.context.lineTo(x, y);
            }
        }

        this.context.stroke();
    };

    animateIn = () => {
        clearTween(this.props);

        this.props.progress = 0;
        this.props.yMultiplier = this.data.sound ? 1 : 0;

        this.animatedIn = false;
        this.needsUpdate = true;

        tween(this.props, { progress: 1 }, 1000, 'easeOutExpo', () => {
            this.needsUpdate = false;
            this.animatedIn = true;
        });

        this.clearTween().tween({ opacity: 1 }, 400, 'easeOutCubic');
    };

    animateOut = () => {
        this.animatedIn = false;

        this.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
    };

    destroy = () => {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    };
}
