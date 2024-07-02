/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Easing } from '../tween/Easing.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, delayedCall, tween } from '../tween/Tween.js';
import { clamp } from '../utils/Utils.js';

export class Graph extends Interface {
    constructor({
        name,
        resolution = 80,
        precision = 0,
        lookupPrecision = 0,
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
        this.lookupPrecision = lookupPrecision;
        this.range = range;
        this.value = value;
        this.noText = noText;
        this.noHover = noHover;
        this.noGradient = noGradient;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.height = this.width / 2;
        this.range = this.getRange(this.range);
        this.array = [];
        this.length = 0;
        this.path = '';
        this.total = 0;
        this.lookup = [];
        this.mouseX = 0;
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.animatedIn = false;
        this.needsUpdate = false;

        this.red = new Color(0xff0000).offsetHSL(-0.05, 0, -0.07);
        this.green = new Color(0x00ff00).offsetHSL(0.04, -0.4, 0);
        this.blue = new Color(0x0000ff).offsetHSL(-0.05, -0.3, -0.07);
        this.alpha = 1;

        this.color = new Color();

        if (this.value === undefined) {
            this.last = performance.now();
            this.time = 0;
            this.deltaTime = 0;
            this.count = 0;
            this.prev = 0;
            this.fps = 0;

            // Midpoint step
            this.refreshRate120 = 1000 / 90;
            this.refreshRate240 = 1000 / 180;
        }

        this.handle = {
            alpha: 0
        };

        this.init();
        this.initGraph();
        this.initCanvas();
        this.setArray(this.value);

        this.resize();
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width,
            height: this.height
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
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

        if (!this.noHover) {
            this.info = new Interface('.info');
            this.info.invisible();
            this.info.css({
                position: 'absolute',
                left: 0,
                bottom: 3,
                marginLeft: 10,
                fontSize: 'var(--ui-secondary-font-size)',
                letterSpacing: 'var(--ui-secondary-letter-spacing)',
                opacity: 0,
                zIndex: 1,
                pointerEvents: 'none'
            });
            this.add(this.info);
        }
    }

    initGraph() {
        // Not added to DOM
        this.graph = new Interface(null, 'svg');
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
    }

    calculateLookup() {
        this.total = this.graph.path.element.getTotalLength();
        this.lookup = [];

        let i = 0;

        while (i <= 1) {
            this.lookup.push(this.graph.path.element.getPointAtLength(this.total * i));

            i += 1 / this.lookupPrecision;
        }
    }

    getCurveY(mouseX) {
        const x = mouseX * this.width;
        const approxIndex = Math.floor(mouseX * this.lookupPrecision);

        let i = Math.max(0, approxIndex - Math.floor(this.lookupPrecision / 3));

        for (; i < this.lookupPrecision; i++) {
            if (this.lookup[i].x > x) {
                break;
            }
        }

        if (i === this.lookupPrecision) {
            return this.lookup[this.lookupPrecision - 1].y;
        }

        const lower = this.lookup[i - 1];
        const upper = this.lookup[i];
        const percent = (x - lower.x) / (upper.x - lower.x);
        const diff = (upper.y - lower.y);
        const y = lower.y + diff * percent;

        return y;
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

        this.strokeStyle = this.createGradient(0, this.height, 0, 0);
        this.fillStyle = this.createGradient(0, this.height, 0, 0, 0.07);
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
        gradient.addColorStop(1, this.toRGBA(this.red, 1));

        return gradient;
    }

    toRGBA(color, alpha) {
        return `rgb(${Math.round(color.r * 255)} ${Math.round(color.g * 255)} ${Math.round(color.b * 255)} / ${alpha * this.alpha})`;
    }

    addListeners() {
        if (!this.noHover) {
            this.element.addEventListener('mouseenter', this.onHover);
            this.element.addEventListener('mouseleave', this.onHover);
            this.element.addEventListener('pointerdown', this.onPointerDown);
            this.element.addEventListener('pointermove', this.onPointerMove);
        }

        ticker.add(this.onUpdate);
    }

    removeListeners() {
        if (!this.noHover) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            this.element.removeEventListener('pointerdown', this.onPointerDown);
            this.element.removeEventListener('pointermove', this.onPointerMove);
        }

        ticker.remove(this.onUpdate);
    }

    getRange(range) {
        return (1 / range) * (this.height - 2);
    }

    // Event handlers

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            return;
        }

        clearTween(this.timeout);

        if (type === 'mouseenter') {
            this.hoverIn();
        } else {
            this.timeout = delayedCall(200, () => {
                this.hoverOut();
            });
        }
    };

    onPointerDown = e => {
        if (!this.animatedIn) {
            return;
        }

        if (this.element.contains(e.target)) {
            this.lastTime = performance.now();
            this.lastMouse.set(e.clientX, e.clientY);

            this.onPointerMove(e);

            window.addEventListener('pointerup', this.onPointerUp);
        }
    };

    onPointerMove = ({ clientX, clientY }) => {
        if (!this.animatedIn) {
            return;
        }

        const event = {
            x: clientX,
            y: clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);

        this.bounds = this.element.getBoundingClientRect();
        this.mouseX = clamp((clientX - this.bounds.left) / this.width, 0, 1);
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);

        if (!this.animatedIn) {
            return;
        }

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        if (!this.element.contains(e.target)) {
            this.hoverOut();
        }
    };

    onUpdate = () => {
        if (this.value === undefined) {
            this.time = performance.now();
            this.deltaTime = this.time - this.last;
            this.last = this.time;

            if (this.time - 1000 > this.prev) {
                this.fps = Math.round(this.count * 1000 / (this.time - this.prev));
                this.prev = this.time;
                this.count = 0;

                if (this.deltaTime < this.refreshRate240) {
                    this.range = this.getRange(720);
                } else if (this.deltaTime < this.refreshRate120) {
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

    setArray(value) {
        if (Array.isArray(value)) {
            if (!this.callback) {
                this.array = value;
            } else {
                this.array = value.slice();
            }
        } else {
            this.array = new Array(this.resolution).fill(0);
        }

        this.length = this.array.length;

        if (this.lookupPrecision > 0) {
            this.path = '';
            this.total = 0;
            this.lookup = [];
            this.needsUpdate = true;
        }
    }

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
                this.setArray(value);
            } else {
                this.array.shift();
                this.array.push(value);
            }
        }

        this.context.globalAlpha = 1;
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw bottom line
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-graph-bottom-line').trim();
        this.context.beginPath();
        this.context.moveTo(0, this.height);
        this.context.lineTo(this.width, this.height);
        this.context.stroke();

        // Draw graph line
        this.context.lineWidth = 1.5;

        if (this.noGradient) {
            this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-line').trim();
        } else {
            this.context.strokeStyle = this.strokeStyle;
            this.context.fillStyle = this.fillStyle;
            this.context.shadowColor = Stage.rootStyle.getPropertyValue('--ui-color-graph-bottom-line').trim();
            this.context.shadowBlur = 15;
        }

        this.context.beginPath();

        for (let i = 0, l = this.length - 1; i < l; i++) {
            const x1 = (i / l) * this.width;
            const x2 = ((i + 1) / l) * this.width;
            const y1 = this.height - this.array[i] * this.range - 1;
            const y2 = this.height - this.array[i + 1] * this.range - 1;
            const xMid = (x1 + x2) / 2;
            const yMid = (y1 + y2) / 2;
            const cpX1 = (xMid + x1) / 2;
            const cpX2 = (xMid + x2) / 2;

            if (i === 0) {
                if (this.needsUpdate) {
                    this.path += `M ${x1} ${y1}`;
                }

                this.context.moveTo(x1, y1);
            } else {
                if (this.needsUpdate) {
                    this.path += ` Q ${cpX1} ${y1} ${xMid} ${yMid} Q ${cpX2} ${y2} ${x2} ${y2}`;
                }

                this.context.quadraticCurveTo(cpX1, y1, xMid, yMid);
                this.context.quadraticCurveTo(cpX2, y2, x2, y2);
            }
        }

        this.context.stroke();

        if (this.needsUpdate) {
            this.graph.path.attr({ d: this.path });
            this.calculateLookup();
            this.needsUpdate = false;
        }

        // Draw gradient fill
        if (!this.noGradient) {
            this.context.shadowBlur = 0;
            this.context.lineTo(this.width, this.height);
            this.context.lineTo(0, this.height);
            this.context.fill();
        }

        // Draw handle line and circle
        if (!this.noHover) {
            const value = this.array[Math.floor(this.mouseX * (this.length - 1))];
            const x = this.mouseX * this.width;

            let y;

            if (this.lookupPrecision > 0) {
                y = this.getCurveY(this.mouseX);
            } else {
                y = this.height - value * this.range - 1;
            }

            if (this.handle.alpha < 0.001) {
                this.handle.alpha = 0;
            }

            this.context.globalAlpha = this.handle.alpha;
            this.context.lineWidth = 1;
            this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

            this.context.beginPath();
            this.context.moveTo(x, y + 2);
            this.context.lineTo(x, this.height);
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(x, y, 2.5, 0, 2 * Math.PI);
            this.context.stroke();

            this.info.css({ left: x });
            this.info.text(value.toFixed(this.precision));
        }
    }

    hoverIn() {
        clearTween(this.handle);
        tween(this.handle, { alpha: 1 }, 275, 'easeInOutCubic');

        this.info.clearTween();
        this.info.visible();
        this.info.tween({ opacity: 1 }, 275, 'easeInOutCubic');
    }

    hoverOut() {
        clearTween(this.handle);
        tween(this.handle, { alpha: 0 }, 275, 'easeInOutCubic');

        this.info.clearTween().tween({ opacity: 0 }, 275, 'easeInOutCubic', () => {
            this.info.invisible();
        });
    }

    enable() {
        this.addListeners();

        this.animatedIn = true;
    }

    disable() {
        this.removeListeners();

        this.animatedIn = false;
    }

    destroy() {
        this.disable();

        return super.destroy();
    }
}
