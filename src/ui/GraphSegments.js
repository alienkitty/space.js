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
import { clamp, mapLinear } from '../utils/Utils.js';

export class GraphSegments extends Interface {
    constructor({
        width = 150,
        height = 50,
        resolution = 80,
        precision = 0,
        lookupPrecision = 0,
        segments = [],
        range = 1,
        value,
        noHover = false,
        noGradient = false
    } = {}) {
        super('.graph-segments');

        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.segments = segments;
        this.range = range;
        this.value = value;
        this.noHover = noHover;
        this.noGradient = noGradient;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.startTime = performance.now();
        this.rangeHeight = this.getRangeHeight(this.range);
        this.array = [];
        this.graphs = [];
        this.mouseX = 0;
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.lastTime = 0;
        this.lastMouse = new Vector2();
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

        this.props = {
            alpha: 0,
            handleAlpha: 0,
            yMultiplier: 0,
            widthMultiplier: 0
        };

        this.init();
        this.initCanvas();

        if (!this.noHover && this.lookupPrecision > 0) {
            this.initGraphs();
        }

        this.setSize(this.width, this.height);
        this.setArray(this.value);

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

    initGraphs() {
        // Not added to DOM
        this.graphs = this.segments.map(() => {
            const graph = new Interface(null, 'svg');
            graph.path = new Interface(null, 'svg', 'path');
            graph.add(graph.path);

            graph.pathData = '';
            graph.total = 0;
            graph.lookup = [];

            return graph;
        });
    }

    calculateLookup(graph) {
        graph.total = graph.path.element.getTotalLength();
        graph.lookup = [];

        let i = 0;

        while (i <= 1) {
            graph.lookup.push(graph.path.element.getPointAtLength(graph.total * i));

            i += 1 / this.lookupPrecision;
        }
    }

    getCurveY(graph, mouseX, width) {
        const x = mouseX * width;
        const approxIndex = Math.floor(mouseX * this.lookupPrecision);

        let i = Math.max(0, approxIndex - Math.floor(this.lookupPrecision / 3));

        for (; i < this.lookupPrecision; i++) {
            if (graph.lookup[i].x > x) {
                break;
            }
        }

        if (i === this.lookupPrecision) {
            return graph.lookup[this.lookupPrecision - 1].y;
        }

        const lower = graph.lookup[i - 1];
        const upper = graph.lookup[i];
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

    getRangeHeight(range) {
        if (Array.isArray(range)) {
            return range.map(range => (this.height - 2) / range);
        } else {
            return new Array(this.segments.length).fill((this.height - 2) / range);
        }
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

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision > 0) {
            this.graphs.forEach(graph => {
                graph.pathData = '';
            });

            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.rangeHeight = this.getRangeHeight(this.range);

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

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision > 0) {
            this.graphs.forEach(graph => {
                graph.pathData = '';
            });

            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    update(value) {
        if (!ticker.isAnimating) {
            ticker.onTick(performance.now() - this.startTime);
        }

        if (!this.array.length) {
            return;
        }

        if (value !== undefined) {
            if (Array.isArray(value)) {
                this.setArray(value);
            } else {
                this.array.shift();
                this.array.push(value);
                this.needsUpdate = true;
            }
        }

        if (this.needsUpdate || this.hoveredIn) {
            this.drawGraph();
            this.needsUpdate = false;
        }
    }

    drawGraph() {
        const w = this.width * this.props.widthMultiplier;
        const h = this.height - 1;

        if (this.props.alpha < 0.001) {
            this.props.alpha = 0;
        }

        this.context.globalAlpha = this.props.alpha;
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw bottom line
        this.context.lineWidth = 1;
        this.context.strokeStyle = Stage.rootStyle.getPropertyValue('--ui-color-graph-bottom-line').trim();
        this.context.beginPath();
        this.context.moveTo(0, h);
        this.context.lineTo(w, h);
        this.context.stroke();

        // Draw segment lines
        for (let i = 1, l = this.graphs.length; i < l; i++) {
            const x = (i / l) * this.width;

            this.context.beginPath();
            this.context.moveTo(x, h - 0.5);
            this.context.lineTo(x, h - h * this.props.yMultiplier);
            this.context.stroke();
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

        let end = 0;

        for (let i = 0, l = this.array.length, il = this.graphs.length; i < il; i++) {
            if (this.props.widthMultiplier === 1) {
                this.context.beginPath();
            }

            const start = end;
            end += this.segments[i];

            const startX = (start / l) * this.width;
            const endX = (end / l) * this.width;
            const segmentWidth = (this.segments[i] / l) * this.width;

            for (let j = 0, jl = this.segments[i] - 1; j < jl; j++) {
                const x1 = (j / jl) * segmentWidth;
                const x2 = ((j + 1) / jl) * segmentWidth;
                const y1 = this.array[start + j] * this.rangeHeight[i];
                const y2 = this.array[start + j + 1] * this.rangeHeight[i];
                const xMid = (x1 + x2) / 2;
                const yMid = (y1 + y2) / 2;
                const cpX1 = (xMid + x1) / 2;
                const cpX2 = (xMid + x2) / 2;

                if (j === 0) {
                    if (this.graphNeedsUpdate) {
                        this.graphs[i].pathData += `M ${x1} ${h - y1}`;
                    }

                    if (this.props.widthMultiplier === 1) {
                        this.context.moveTo(startX + x1, h - y1 * this.props.yMultiplier);
                    }
                } else {
                    if (this.graphNeedsUpdate) {
                        this.graphs[i].pathData += ` Q ${cpX1} ${h - y1} ${xMid} ${h - yMid} Q ${cpX2} ${h - y2} ${x2} ${h - y2}`;
                    }

                    if (this.props.widthMultiplier === 1) {
                        this.context.quadraticCurveTo(startX + cpX1, h - y1 * this.props.yMultiplier, startX + xMid, h - yMid * this.props.yMultiplier);
                        this.context.quadraticCurveTo(startX + cpX2, h - y2 * this.props.yMultiplier, startX + x2, h - y2 * this.props.yMultiplier);
                    }
                }
            }

            if (this.props.widthMultiplier === 1) {
                this.context.stroke();

                // Draw gradient fill
                if (!this.noGradient) {
                    this.context.shadowBlur = 0;
                    this.context.lineTo(endX, this.height);
                    this.context.lineTo(startX, this.height);
                    this.context.fill();
                }
            }
        }

        if (this.props.widthMultiplier < 1) {
            this.context.beginPath();
            this.context.moveTo(0, h);
            this.context.lineTo(w, h);
            this.context.stroke();
        }

        // Draw handle line and circle
        if (!this.noHover) {
            if (this.graphNeedsUpdate) {
                this.graphs.forEach(graph => {
                    graph.path.attr({ d: graph.pathData });
                    this.calculateLookup(graph);
                });

                this.graphNeedsUpdate = false;
            }

            const length = this.array.length;
            const x = this.mouseX * this.width;

            let i = 0;
            let start = 0;
            let width = 0;
            let end = 0;

            for (let l = this.graphs.length; i < l; i++) {
                start = end;
                width = this.segments[i] / length;
                end += width;

                if (this.mouseX >= start && this.mouseX <= end) {
                    break;
                }
            }

            const value = this.array[Math.floor(start + this.mouseX * (length - 1))];

            let y;

            if (this.lookupPrecision > 0) {
                const mouseX = clamp(mapLinear(this.mouseX, start, end, 0, 1), 0, 1);

                y = this.getCurveY(this.graphs[i], mouseX, width * this.width);
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

    hoverIn(force) {
        if (this.hoveredIn && !force) {
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

    animateIn() {
        clearTween(this.props);

        tween(this.props, { alpha: 1 }, 500, 'easeOutSine');

        tween(this.props, { widthMultiplier: 1 }, 500, 'easeInOutCubic', () => {
            tween(this.props, { yMultiplier: 1 }, 400, 'easeOutCubic', () => {
                this.animatedIn = true;

                if (this.hoveredIn) {
                    this.hoverIn(true);
                }
            }, () => {
                this.needsUpdate = true;
            });
        }, () => {
            this.needsUpdate = true;
        });
    }

    animateOut() {
        clearTween(this.props);

        this.animatedIn = false;

        tween(this.props, { alpha: 0 }, 300, 'easeOutSine');

        tween(this.props, { yMultiplier: 0 }, 300, 'easeOutCubic', null, () => {
            this.needsUpdate = true;
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
