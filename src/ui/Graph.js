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
        width = 150,
        height = 50,
        resolution = 80,
        precision = 0,
        lookupPrecision = 0,
        range = 1,
        value,
        noHover = false,
        noGradient = false
    } = {}) {
        super('.graph');

        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.range = range;
        this.value = value;
        this.noHover = noHover;
        this.noGradient = noGradient;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.startTime = performance.now();
        this.range = this.getRange(this.range);
        this.array = [];
        this.path = '';
        this.total = 0;
        this.lookup = [];
        this.mouseX = 0;
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.hoveredIn = false;
        this.needsUpdate = false;

        this.colorRange = [
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-1').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-2').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-3').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-4').trim())
        ];

        this.colorStep = 1 / 3 / 5; // 5 steps per colour interpolation
        this.color = new Color();
        this.alpha = 1;

        this.handle = {
            alpha: 0
        };

        this.init();
        this.initGraph();
        this.initCanvas();
        this.setSize(this.width, this.height);

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width,
            height: this.height,
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        if (!this.noHover) {
            this.info = new Interface('.info');
            this.info.invisible();
            this.info.css({
                position: 'absolute',
                left: 0,
                bottom: 'calc((var(--ui-line-height) + 3px) * -1)',
                transform: 'translateX(-50%)',
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
        this.graph.path = new Interface(null, 'svg', 'path');
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
    }

    createGradient(x1, y1, x2, y2, alpha = 1) {
        this.alpha = alpha;

        const gradient = this.context.createLinearGradient(x1, y1, x2, y2);

        let offset = 0;

        for (let i = 0; i < 3; i++) {
            for (let t = 0; t < 5; t++) {
                gradient.addColorStop(offset, this.toRGBA(this.color.lerpColors(this.colorRange[i], this.colorRange[i + 1], Easing.easeInOutSine(t / 5)), 1));

                offset += this.colorStep;
            }
        }

        gradient.addColorStop(offset, this.toRGBA(this.colorRange[3], 1));

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
            window.addEventListener('pointermove', this.onPointerMove);
        }
    }

    removeListeners() {
        if (!this.noHover) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            this.element.removeEventListener('pointerdown', this.onPointerDown);
            window.removeEventListener('pointermove', this.onPointerMove);
        }
    }

    getRange(range) {
        return (1 / range) * (this.height - 2);
    }

    // Event handlers

    onHover = ({ type }) => {
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
        if (this.element.contains(e.target)) {
            this.lastTime = performance.now();
            this.lastMouse.set(e.clientX, e.clientY);

            this.onPointerMove(e);

            window.addEventListener('pointerup', this.onPointerUp);
        }
    };

    onPointerMove = ({ clientX, clientY }) => {
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

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        if (!this.element.contains(e.target)) {
            this.hoverOut();
        }
    };

    // Public methods

    setArray(value) {
        if (Array.isArray(value)) {
            this.array = value;
        } else {
            this.array = new Array(this.resolution).fill(0);
        }

        if (this.lookupPrecision > 0) {
            this.path = '';
            this.total = 0;
            this.lookup = [];
            this.needsUpdate = true;
        }
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.css({
            width: this.width,
            height: this.height
        });

        const dpr = 2; // Always 2

        this.canvas.element.width = Math.round(this.width * dpr);
        this.canvas.element.height = Math.round(this.height * dpr);
        this.canvas.element.style.width = `${this.width}px`;
        this.canvas.element.style.height = `${this.height}px`;
        this.context.scale(dpr, dpr);

        this.strokeStyle = this.createGradient(0, this.height, 0, 0);
        this.fillStyle = this.createGradient(0, this.height, 0, 0, 0.07);

        this.setArray(this.value);
        this.update();
    }

    update(value) {
        if (!ticker.isAnimating) {
            ticker.onTick(performance.now() - this.startTime);
        }

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

        for (let i = 0, l = this.array.length - 1; i < l; i++) {
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
            const value = this.array[Math.floor(this.mouseX * (this.array.length - 1))];
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
        if (this.hoveredIn) {
            return;
        }

        this.hoveredIn = true;

        clearTween(this.handle);
        tween(this.handle, { alpha: 1 }, 275, 'easeInOutCubic');

        this.info.clearTween();
        this.info.visible();
        this.info.tween({ opacity: 1 }, 275, 'easeInOutCubic');
    }

    hoverOut() {
        if (!this.hoveredIn) {
            return;
        }

        this.hoveredIn = false;

        clearTween(this.handle);
        tween(this.handle, { alpha: 0 }, 275, 'easeInOutCubic');

        this.info.clearTween().tween({ opacity: 0 }, 275, 'easeInOutCubic', () => {
            this.info.invisible();
        });
    }

    animateIn() {
    }

    animateOut() {
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
