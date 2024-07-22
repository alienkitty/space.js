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
import { clearTween, delayedCall, tween } from '../tween/Tween.js';
import { clamp } from '../utils/Utils.js';

export class PanelGraph extends Interface {
    constructor({
        name,
        resolution = 80,
        precision = 0,
        lookupPrecision = 0,
        range = 1,
        value,
        ghost,
        noText = false,
        noHover = false,
        noGradient = false,
        callback
    }) {
        super('.panel-graph');

        this.name = name;
        this.resolution = resolution;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.range = range;
        this.value = value;
        this.ghost = ghost;
        this.noText = noText;
        this.noHover = noHover;
        this.noGradient = noGradient;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.height = this.width / 2;
        this.rangeHeight = this.getRangeHeight(this.range);
        this.array = [];
        this.ghostArray = [];
        this.pathData = '';
        this.total = 0;
        this.lookup = [];
        this.bounds = null;
        this.mouseX = 0;
        this.animatedIn = false;
        this.hoveredIn = false;
        this.needsUpdate = false;
        this.graphNeedsUpdate = false;

        this.colorRange = [
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-1').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-2').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-3').trim()),
            new Color(Stage.rootStyle.getPropertyValue('--ui-color-range-4').trim())
        ];

        this.colorStep = 1 / 3 / 5; // 5 steps per colour interpolation
        this.color = new Color();
        this.alpha = 1;

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

        this.props = {
            handleAlpha: 0
        };

        this.init();
        this.initCanvas();

        if (!this.noHover && this.lookupPrecision > 0) {
            this.initGraph();
        }

        this.setArray(this.value);

        if (this.ghost) {
            this.setGhostArray(this.ghost);
        }

        this.resize();
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width,
            height: this.height,
            cursor: 'crosshair'
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

    createGradient(x0, y0, x1, y1, alpha = 1) {
        this.alpha = alpha;

        const gradient = this.context.createLinearGradient(x0, y0, x1, y1);

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
            window.addEventListener('pointerdown', this.onPointerDown);
            this.element.addEventListener('pointermove', this.onPointerMove);
        }

        ticker.add(this.onUpdate);
    }

    removeListeners() {
        if (!this.noHover) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            window.removeEventListener('pointerdown', this.onPointerDown);
            this.element.removeEventListener('pointermove', this.onPointerMove);
        }

        ticker.remove(this.onUpdate);
    }

    getRangeHeight(range) {
        return (this.height - 2) / range;
    }

    // Event handlers

    onHover = ({ type }) => {
        if (!this.animatedIn) {
            if (type === 'mouseenter') {
                this.hoveredIn = true;
            } else {
                this.hoveredIn = false;
            }

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
            this.onPointerMove(e);
            this.hoverIn();
        } else {
            this.hoverOut();
        }
    };

    onPointerMove = ({ clientX }) => {
        if (!this.animatedIn) {
            return;
        }

        this.bounds = this.element.getBoundingClientRect();
        this.mouseX = clamp((clientX - this.bounds.left) / this.width, 0, 1);
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
                    this.rangeHeight = this.getRangeHeight(720);
                } else if (this.deltaTime < this.refreshRate120) {
                    this.rangeHeight = this.getRangeHeight(360);
                } else {
                    this.rangeHeight = this.getRangeHeight(180);
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

    setGhostArray(value) {
        if (Array.isArray(value)) {
            this.ghostArray = value;
        } else {
            this.ghostArray = new Array(this.resolution).fill(0);
        }

        this.needsUpdate = true;

        this.update();
    }

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

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision > 0) {
            this.pathData = '';
            this.graphNeedsUpdate = true;
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
                if (this.ghost) {
                    const ghost = this.array.pop();
                    this.array.unshift(value);
                    this.ghostArray.pop();
                    this.ghostArray.unshift(ghost);
                } else {
                    this.array.shift();
                    this.array.push(value);
                }

                this.needsUpdate = true;
            }
        }

        if (this.needsUpdate || this.hoveredIn) {
            this.drawGraph();
            this.needsUpdate = false;
        }
    }

    drawGraph() {
        const h = this.height - 1;

        this.context.globalAlpha = 1;
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw bottom line
        this.context.lineWidth = 1;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-graph-bottom-line').trim();
        this.context.beginPath();
        this.context.moveTo(0, h);
        this.context.lineTo(this.width, h);
        this.context.stroke();

        // Draw graph line and linear gradient fill
        if (this.ghostArray.length) {
            this.drawPath(h, this.ghostArray, true);
        }

        this.drawPath(h, this.array);

        // Draw handle line and circle
        if (!this.noHover) {
            if (this.graphNeedsUpdate) {
                this.graph.path.attr({ d: this.pathData });
                this.calculateLookup();
                this.graphNeedsUpdate = false;
            }

            const value = this.array[Math.floor(this.mouseX * (this.array.length - 1))];
            const x = this.mouseX * this.width;

            let y;

            if (this.lookupPrecision > 0) {
                y = this.getCurveY(this.mouseX);
            } else {
                y = h - value * this.rangeHeight;
            }

            if (this.props.handleAlpha < 0.001) {
                this.props.handleAlpha = 0;
            }

            this.context.globalAlpha = this.props.handleAlpha;
            this.context.lineWidth = 1;
            this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color').trim();

            this.context.beginPath();
            this.context.moveTo(x, this.height - 0.5);
            this.context.lineTo(x, y + 2);
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(x, y, 2.5, 0, 2 * Math.PI);
            this.context.stroke();

            this.info.css({ left: x });
            this.info.text(value.toFixed(this.precision));
        }
    }

    drawPath(h, array, ghost) {
        if (ghost) {
            this.context.globalAlpha = 0.35;
        } else {
            this.context.globalAlpha = 1;
        }

        // Draw graph line
        this.context.lineWidth = 1.5;

        if (this.noGradient) {
            this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-line').trim();
        } else {
            this.context.strokeStyle = this.strokeStyle;
            this.context.fillStyle = this.fillStyle;
            this.context.shadowColor = 'rgb(255 255 255 / 0.2)';
            this.context.shadowBlur = 15;
        }

        this.context.beginPath();

        for (let i = 0, l = array.length; i < l - 1; i++) {
            const x0 = (i / (l - 1)) * this.width;
            const x1 = ((i + 1) / (l - 1)) * this.width;
            const y0 = h - array[i] * this.rangeHeight;
            const y1 = h - array[i + 1] * this.rangeHeight;
            const midX = (x0 + x1) / 2;
            const midY = (y0 + y1) / 2;
            const cpX1 = (midX + x0) / 2;
            const cpX2 = (midX + x1) / 2;

            if (i === 0) {
                if (this.graphNeedsUpdate && !ghost) {
                    this.pathData += `M ${x0} ${y0}`;
                }

                this.context.moveTo(x0, y0);
            }

            if (this.graphNeedsUpdate && !ghost) {
                this.pathData += ` Q ${cpX1} ${y0} ${midX} ${midY} Q ${cpX2} ${y1} ${x1} ${y1}`;
            }

            this.context.quadraticCurveTo(cpX1, y0, midX, midY);
            this.context.quadraticCurveTo(cpX2, y1, x1, y1);
        }

        this.context.stroke();

        // Draw linear gradient fill
        if (!this.noGradient) {
            this.context.shadowBlur = 0;
            this.context.lineTo(this.width, this.height);
            this.context.lineTo(0, this.height);
            this.context.fill();
        }
    }

    hoverIn() {
        if (this.hoveredIn) {
            return;
        }

        clearTween(this.props);

        this.hoveredIn = true;

        tween(this.props, { handleAlpha: 1 }, 275, 'easeInOutCubic', null, () => {
            this.needsUpdate = true;
        });

        this.info.clearTween();
        this.info.visible();
        this.info.tween({ opacity: 1 }, 275, 'easeInOutCubic');
    }

    hoverOut() {
        if (!this.hoveredIn) {
            return;
        }

        clearTween(this.props);

        this.hoveredIn = false;

        tween(this.props, { handleAlpha: 0 }, 275, 'easeInOutCubic', null, () => {
            this.needsUpdate = true;
        });

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
