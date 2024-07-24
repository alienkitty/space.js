/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { AudioButtonInfo } from './AudioButtonInfo.js';

import { clearTween, tween } from '../tween/Tween.js';

export class AudioButton extends Interface {
    constructor({
        sound,
        callback
    }) {
        super('.button');

        this.sound = sound;
        this.callback = callback;

        this.width = 24;
        this.height = 16;
        this.animatedIn = false;
        this.needsUpdate = false;

        this.props = {
            yMultiplier: this.sound ? 1 : 0,
            progress: 0
        };

        this.init();
        this.initCanvas();
        this.setSound(this.sound);

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative'
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            width: this.width + 20,
            height: this.height + 20,
            cursor: 'pointer',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none',
            opacity: 0
        });
        this.add(this.container);
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
        this.container.add(this.canvas);
    }

    addListeners() {
        this.container.element.addEventListener('mouseenter', this.onHover);
        this.container.element.addEventListener('mouseleave', this.onHover);
        this.container.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.container.element.removeEventListener('mouseenter', this.onHover);
        this.container.element.removeEventListener('mouseleave', this.onHover);
        this.container.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            return;
        }

        clearTween(this.props);

        this.needsUpdate = true;

        if (type === 'mouseenter') {
            tween(this.props, { yMultiplier: this.sound ? 0.7 : 0.3 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            tween(this.props, { yMultiplier: this.sound ? 1 : 0 }, 275, 'easeInOutCubic', () => {
                this.needsUpdate = false;
            });
        }
    };

    onClick = () => {
        clearTween(this.props);

        if (this.sound) {
            this.sound = false;

            this.needsUpdate = true;

            tween(this.props, { yMultiplier: 0 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        } else {
            this.sound = true;

            this.needsUpdate = true;

            tween(this.props, { yMultiplier: 1 }, 300, 'easeOutCubic', () => {
                this.needsUpdate = false;
            });
        }

        this.setSound(this.sound);
    };

    // Public methods

    setData(data) {
        if (!this.info) {
            this.info = new AudioButtonInfo();
            this.info.css({
                position: 'absolute',
                left: -145,
                top: 0
            });
            this.add(this.info);
        }

        this.info.setData(data);
    }

    setSound(sound) {
        this.events.emit('update', { sound, target: this });

        if (this.callback) {
            this.callback(sound, this);
        }
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
        const width = this.width + 2;
        const height = this.height / 2;
        const progress = width * this.props.progress;
        const increase = 90 / 180 * Math.PI / (height / 2);

        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);
        this.context.beginPath();

        let counter = 0;
        let x = 0;
        let y = height;

        for (let i = -4; i < width; i++) {
            if (progress >= i) {
                this.context.moveTo(x, y);

                x = i;
                y = height - Math.sin(counter) * (height - 1) * this.props.yMultiplier;
                counter += increase;

                this.context.lineTo(x, y);
            }
        }

        this.context.stroke();
    }

    animateIn() {
        clearTween(this.props);

        this.props.progress = 0;
        this.props.yMultiplier = this.sound ? 1 : 0;

        this.animatedIn = false;
        this.needsUpdate = true;

        tween(this.props, { progress: 1 }, 1000, 'easeOutExpo', () => {
            this.needsUpdate = false;
            this.animatedIn = true;
        });

        this.container.clearTween().tween({ opacity: 1 }, 400, 'easeOutCubic');
    }

    animateOut() {
        this.animatedIn = false;

        this.container.clearTween().tween({ opacity: 0 }, 400, 'easeOutCubic');
    }

    destroy() {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    }
}
