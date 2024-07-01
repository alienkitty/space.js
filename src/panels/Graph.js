/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Color } from '../math/Color.js';
import { Easing } from '../tween/Easing.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { ticker } from '../tween/Ticker.js';

export class Graph extends Interface {
    constructor({
        name,
        resolution = 80,
        precision = 0,
        range = 1,
        value,
        noText = false,
        noHover = false,
        noGradient = false,
        callback
    }) {
        super('.graph');

        this.name = name;
        this.resolution = resolution;
        this.precision = precision;
        this.range = range;
        this.value = value;
        this.noText = noText;
        this.noHover = noHover;
        this.noGradient = noGradient;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.height = this.width / 2;
        this.range = this.getRange(this.range);

        if (Array.isArray(this.value)) {
            if (!this.callback) {
                this.values = value;
            } else {
                this.values = value.slice();
            }
        } else {
            this.values = new Array(this.resolution).fill(0);
        }

        if (this.value === undefined) {
            this.last = performance.now();
            this.time = 0;
            this.delta = 0;
            this.count = 0;
            this.prev = 0;
            this.fps = 0;

            // Midpoint step
            this.refreshRate120 = 1000 / 90;
            this.refreshRate240 = 1000 / 180;
        }

        this.red = new Color(0xff0000).offsetHSL(-0.05, 0, -0.07);
        this.green = new Color(0x00ff00).offsetHSL(0.04, -0.4, 0);
        this.blue = new Color(0x0000ff).offsetHSL(-0.05, -0.3, -0.07);
        this.alpha = 1;
        this.color = new Color();

        this.init();
        this.initGraph();
        this.initCanvas();

        this.resize();
    }

    init() {
        this.css({
            position: 'relative',
            height: this.height
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            height: 20,
            whiteSpace: 'nowrap',
            zIndex: 1,
            pointerEvents: 'none'
        });
        this.add(this.container);

        this.content = new Interface('.content');
        this.content.css({
            cssFloat: 'left',
            marginRight: 10,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
        });
        this.content.text(this.name);
        this.container.add(this.content);

        if (!this.noText) {
            this.number = new Interface('.number');
            this.number.css({
                cssFloat: 'right',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 1
            });
            this.container.add(this.number);
        }
    }

    initGraph() {
        this.graph = new Interface(null, 'svg');
        this.graph.hide();
        this.graph.attr({
            viewBox: `0 0 ${this.width} ${this.height}`,
            width: this.width,
            height: this.height
        });
        this.graph.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: this.width,
            height: this.height
        });

        this.graph.path = new Interface(null, 'svg', 'path');
        this.graph.path.css({
            fill: 'none',
            stroke: 'var(--ui-color)',
            strokeWidth: 1.5
        });
        this.graph.add(this.graph.path);

        this.add(this.graph);
    }

    createPath(values) {
        let path = '';

        for (let i = 0, l = values.length - 1; i < l; i++) {
            const x1 = (i / l) * this.width;
            const x2 = ((i + 1) / l) * this.width;
            const y1 = this.height - values[i] * this.range - 1;
            const y2 = this.height - values[i + 1] * this.range - 1;
            const xMid = (x1 + x2) / 2;
            const yMid = (y1 + y2) / 2;
            const cpX1 = (xMid + x1) / 2;
            const cpX2 = (xMid + x2) / 2;

            if (i === 0) {
                path += `M ${x1} ${y1}`;
            } else {
                path += ` Q ${cpX1} ${y1} ${xMid} ${yMid} Q ${cpX2} ${y2} ${x2} ${y2}`;
            }
        }

        return path;
    }

    initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none'
        });
        this.context = this.canvas.element.getContext('2d');
        this.add(this.canvas);
    }

    createGradient(x1, y1, x2, y2, alpha = 1) {
        this.alpha = alpha;

        const gradient = this.context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, this.toRGBA(this.blue, 1));
        this.color.copy(this.blue);
        gradient.addColorStop(0.1, this.toRGBA(this.color.lerp(this.green, Easing.easeInOutSine(0)), 1));
        gradient.addColorStop(0.15, this.toRGBA(this.color.lerp(this.green, Easing.easeInOutSine(0.25)), 1));
        gradient.addColorStop(0.2, this.toRGBA(this.color.lerp(this.green, Easing.easeInOutSine(0.5)), 1));
        gradient.addColorStop(0.25, this.toRGBA(this.color.lerp(this.green, Easing.easeInOutSine(0.75)), 1));
        gradient.addColorStop(0.3, this.toRGBA(this.color.lerp(this.green, Easing.easeInOutSine(1)), 1));
        gradient.addColorStop(0.7, this.toRGBA(this.green, 1));
        // this.color.copy(this.green);
        // gradient.addColorStop(0.7, this.toRGBA(this.color.lerp(this.red, Easing.easeInOutSine(0)), 1));
        // gradient.addColorStop(0.75, this.toRGBA(this.color.lerp(this.red, Easing.easeInOutSine(0.25)), 1));
        // gradient.addColorStop(0.8, this.toRGBA(this.color.lerp(this.red, Easing.easeInOutSine(0.5)), 1));
        // gradient.addColorStop(0.85, this.toRGBA(this.color.lerp(this.red, Easing.easeInOutSine(0.75)), 1));
        // gradient.addColorStop(0.9, this.toRGBA(this.color.lerp(this.red, Easing.easeInOutSine(1)), 1));
        gradient.addColorStop(1, this.toRGBA(this.red, 1));

        return gradient;
    }

    toRGBA(color, alpha) {
        return 'rgb(' + Math.round(color.r * 255) + ' ' + Math.round(color.g * 255) + ' ' + Math.round(color.b * 255) + ' / ' + alpha * this.alpha + ')';
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    getRange(range) {
        return (1 / range) * (this.height - 2);
    }

    // Event handlers

    onUpdate = () => {
        if (this.value === undefined) {
            this.time = performance.now();
            this.delta = this.time - this.last;
            this.last = this.time;

            if (this.time - 1000 > this.prev) {
                this.fps = Math.round(this.count * 1000 / (this.time - this.prev));
                this.prev = this.time;
                this.count = 0;

                if (this.delta < this.refreshRate240) {
                    this.range = this.getRange(720);
                } else if (this.delta < this.refreshRate120) {
                    this.range = this.getRange(360);
                } else {
                    this.range = this.getRange(180);
                }
            }

            this.count++;

            this.update(this.fps);
            this.setValue(this.fps);
        } else if (this.callback) {
            this.value = this.callback(this.value, this);
        } else {
            this.update();
        }
    };

    // Public methods

    setValue(value) {
        if (this.number) {
            this.number.text(value.toFixed(this.precision));
        }
    }

    resize() {
        const dpr = 2; // Always 2

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        this.canvas.element.style.width = `${this.width}px`;
        this.canvas.element.style.height = `${this.height}px`;
        this.context.scale(dpr, dpr);

        this.update();
    }

    update(value) {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                this.values = value.slice();
            } else {
                this.values.shift();
                this.values.push(value);
            }
        }

        // this.graph.path.attr({ d: this.createPath(this.values) });

        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw bottom line
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = 'rgb(255 255 255 / 0.2)';
        this.context.beginPath();
        this.context.moveTo(0, this.height);
        this.context.lineTo(this.width, this.height);
        this.context.stroke();

        // Draw graph line
        this.context.lineWidth = 1.5;

        if (this.noGradient) {
            this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-line').trim();
        } else {
            this.context.strokeStyle = this.createGradient(0, this.height, 0, 0);
            this.context.fillStyle = this.createGradient(0, this.height, 0, 0, 0.07);
            this.context.shadowColor = 'rgb(255 255 255 / 0.2)';
            this.context.shadowBlur = 15;
        }

        this.context.beginPath();

        for (let i = 0, l = this.values.length - 1; i < l; i++) {
            const x1 = (i / l) * this.width;
            const x2 = ((i + 1) / l) * this.width;
            const y1 = this.height - this.values[i] * this.range - 1;
            const y2 = this.height - this.values[i + 1] * this.range - 1;
            const xMid = (x1 + x2) / 2;
            const yMid = (y1 + y2) / 2;
            const cpX1 = (xMid + x1) / 2;
            const cpX2 = (xMid + x2) / 2;

            if (i === 0) {
                this.context.moveTo(x1, y1);
            } else {
                this.context.quadraticCurveTo(cpX1, y1, xMid, yMid);
                this.context.quadraticCurveTo(cpX2, y2, x2, y2);
            }
        }

        this.context.stroke();

        // Draw gradient fill
        if (!this.noGradient) {
            this.context.shadowBlur = 0;
            this.context.lineTo(this.width, this.height);
            this.context.lineTo(0, this.height);
            this.context.fill();
        }
    }

    enable() {
        this.addListeners();

        this.isVisible = true;

        this.graph.show();
    }

    disable() {
        this.removeListeners();

        this.isVisible = false;

        this.graph.hide();
        this.number.empty();
    }

    destroy() {
        this.disable();

        return super.destroy();
    }
}
