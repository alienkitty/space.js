/**
 * @author pschroen / https://ufo.ai/
 */

import { Color } from '../math/Color.js';
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
        markers = [],
        range = 1,
        value,
        ghost,
        noHover = false,
        noMarker = false,
        noGradient = false
    } = {}) {
        super('.graph');

        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.markers = markers;
        this.range = range;
        this.value = value;
        this.ghost = ghost;
        this.noHover = noHover;
        this.noMarker = noMarker;
        this.noGradient = noGradient;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.startTime = performance.now();
        this.frame = 0;

        this.rangeHeight = this.getRangeHeight(this.range);
        this.array = [];
        this.ghostArray = [];
        this.pathData = '';
        this.length = 0;
        this.lookup = [];
        this.bounds = null;
        this.mouseX = 0;
        this.items = [];
        this.animatedIn = false;
        this.hoveredIn = false;
        this.needsUpdate = false;
        this.graphNeedsUpdate = false;

        this.lineColors = {
            graph: Stage.rootStyle.getPropertyValue('--ui-color-line').trim(),
            bottom: Stage.rootStyle.getPropertyValue('--ui-color-graph-bottom-line').trim(),
            handle: Stage.rootStyle.getPropertyValue('--ui-color').trim()
        };

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
            progress: 0
        };

        this.init();
        this.initCanvas();

        if (!this.noHover && this.lookupPrecision) {
            this.initGraph();
        }

        if (!this.noMarker) {
            this.initMarkers();
        }

        this.setSize(this.width, this.height);
        this.setArray(this.value);

        if (this.ghost) {
            this.setGhostArray(this.ghost);
        }

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width,
            height: this.height,
            cursor: 'crosshair',
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
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0
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
        this.length = this.graph.path.element.getTotalLength();
        this.lookup = [];

        let i = 0;

        while (i <= 1) {
            this.lookup.push(this.graph.path.element.getPointAtLength(i * this.length));

            i += 1 / this.lookupPrecision;
        }
    }

    getCurveY(mouseX) {
        const x = mouseX * this.width;
        const approxIndex = Math.floor(mouseX * this.lookupPrecision);

        let i = Math.max(1, approxIndex - Math.floor(this.lookupPrecision / 3));

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
        const diff = upper.y - lower.y;
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

    initMarkers() {
        this.markers.map(data => {
            this.addMarker(data, 500);
        });
    }

    addListeners() {
        if (!this.noHover) {
            this.element.addEventListener('mouseenter', this.onHover);
            this.element.addEventListener('mouseleave', this.onHover);
            window.addEventListener('pointerdown', this.onPointerDown);
            window.addEventListener('pointermove', this.onPointerMove);
        }

        if (!this.noMarker) {
            if (navigator.maxTouchPoints) {
                this.element.addEventListener('contextmenu', this.onContextMenu);
            } else {
                this.element.addEventListener('click', this.onClick);
            }
        }
    }

    removeListeners() {
        if (!this.noHover) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            window.removeEventListener('pointerdown', this.onPointerDown);
            window.removeEventListener('pointermove', this.onPointerMove);
        }

        if (!this.noMarker) {
            if (navigator.maxTouchPoints) {
                this.element.removeEventListener('contextmenu', this.onContextMenu);
            } else {
                this.element.removeEventListener('click', this.onClick);
            }
        }
    }

    getRangeHeight(range) {
        return (this.height - 5) / range;
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
            this.onPointerMove(e);
            this.hoverIn();
        } else {
            this.hoverOut();
        }
    };

    onPointerMove = ({ clientX }) => {
        this.bounds = this.element.getBoundingClientRect();
        this.mouseX = clamp((clientX - this.bounds.left) / this.width, 0, 1);
    };

    onContextMenu = e => {
        e.preventDefault();

        this.onClick();
    };

    onClick = () => {
        if (this.items.find(item => item.x === this.mouseX)) {
            return;
        }

        this.addMarker([this.mouseX, this.getMarkerName()]);
    };

    // Public methods

    getMarkerName() {
        const names = this.items.map(item => item.name);

        let count = 1;
        let name = `Marker ${count++}`;

        while (names.includes(name)) {
            name = `Marker ${count++}`;
        }

        return name;
    }

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
            this.array = value;
        } else {
            this.array = new Array(this.resolution).fill(0);
        }

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision) {
            this.pathData = '';
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

        if (!this.noHover && this.lookupPrecision) {
            this.pathData = '';
            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    addMarker([x, name], delay = 0) {
        const item = new Interface('.name');
        item.css({
            position: 'absolute',
            left: 0,
            top: -21,
            transform: 'translateX(-50%)',
            lineHeight: 18,
            whiteSpace: 'nowrap',
            zIndex: 1,
            opacity: 0
        });
        item.x = x;
        item.name = name;
        item.multiplier = 0;
        item.html(name);
        this.add(item);

        this.items.push(item);

        tween(item, { multiplier: 1 }, 400, 'easeOutCubic', delay, null, () => {
            this.needsUpdate = true;

            item.css({ opacity: item.multiplier });
        });
    }

    update(value) {
        if (!ticker.isAnimating && ++this.frame > ticker.frame) {
            ticker.onTick(performance.now() - this.startTime);
        }

        if (!this.array.length) {
            return;
        }

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
        const w = this.width * this.props.progress;
        const h = this.height - 1;

        if (this.props.alpha < 0.001) {
            this.context.globalAlpha = 0;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw bottom line
        this.context.lineWidth = 1;
        this.context.strokeStyle = this.lineColors.bottom;

        this.context.beginPath();
        this.context.moveTo(0, h);
        this.context.lineTo(w, h);
        this.context.stroke();

        // Draw graph line and linear gradient fill
        if (this.ghostArray.length) {
            this.drawPath(w, h, this.ghostArray, true);
        }

        this.drawPath(w, h, this.array);

        // Draw marker lines
        if (!this.noMarker) {
            this.context.lineWidth = 1.5;
            this.context.strokeStyle = this.lineColors.graph;

            for (let i = 0, l = this.items.length; i < l; i++) {
                const x = this.items[i].x * this.width - 0.5;

                this.context.beginPath();
                this.context.moveTo(x, h - 0.5);
                this.context.lineTo(x, h - 0.5 - (h - 0.5) * this.items[i].multiplier * this.props.yMultiplier);
                this.context.stroke();
            }

            this.items.forEach(item => {
                item.css({ left: item.x * this.width - 0.5 });
            });
        }

        // Draw handle line and circle
        if (!this.noHover) {
            if (this.graphNeedsUpdate) {
                this.graph.path.attr({ d: this.pathData });
                this.calculateLookup();
                this.graphNeedsUpdate = false;
            }

            let index = Math.floor(this.mouseX * this.array.length);

            if (index === this.array.length) {
                index = this.array.length - 1;
            }

            const value = this.array[index];
            const x = this.mouseX * this.width;

            let y;

            if (this.lookupPrecision) {
                y = this.getCurveY(this.mouseX) - 1;
            } else {
                y = h - value * this.rangeHeight - 1;
            }

            if (this.props.handleAlpha < 0.001) {
                this.context.globalAlpha = 0;
            } else {
                this.context.globalAlpha = this.props.handleAlpha;
            }

            this.context.lineWidth = 1;
            this.context.strokeStyle = this.lineColors.handle;

            this.context.beginPath();
            this.context.moveTo(x, this.height);
            this.context.lineTo(x, y + 2);
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(x, y, 2.5, 0, Math.PI * 2);
            this.context.stroke();

            this.info.css({ left: x });
            this.info.text(value.toFixed(this.precision));
        }
    }

    drawPath(w, h, array, ghost) {
        if (ghost) {
            this.context.globalAlpha = 0.35;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        // Draw graph line
        this.context.lineWidth = 1.5;

        if (this.noGradient) {
            this.context.strokeStyle = this.lineColors.graph;
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
            const y0 = array[i] * this.rangeHeight;
            const y1 = array[i + 1] * this.rangeHeight;
            const mx = (x0 + x1) / 2;
            const my = (y0 + y1) / 2;
            const cpx0 = (mx + x0) / 2;
            const cpx1 = (mx + x1) / 2;

            if (i === 0) {
                if (this.graphNeedsUpdate && !ghost) {
                    this.pathData += `M ${x0} ${h - y0}`;
                }

                if (this.props.progress === 1) {
                    this.context.moveTo(x0, h - y0 * this.props.yMultiplier - 1);
                }
            }

            if (this.graphNeedsUpdate && !ghost) {
                this.pathData += ` Q ${cpx0} ${h - y0} ${mx} ${h - my} Q ${cpx1} ${h - y1} ${x1} ${h - y1}`;
            }

            if (this.props.progress === 1) {
                this.context.quadraticCurveTo(cpx0, h - y0 * this.props.yMultiplier - 1, mx, h - my * this.props.yMultiplier - 1);
                this.context.quadraticCurveTo(cpx1, h - y1 * this.props.yMultiplier - 1, x1, h - y1 * this.props.yMultiplier - 1);
            }
        }

        if (this.props.progress < 1) {
            this.context.moveTo(0, h);
            this.context.lineTo(w, h);
        }

        this.context.stroke();

        // Draw linear gradient fill
        if (!this.noGradient && this.props.progress === 1) {
            this.context.shadowBlur = 0;
            this.context.lineTo(this.width, this.height);
            this.context.lineTo(0, this.height);
            this.context.fill();
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

        tween(this.props, { progress: 1 }, 500, 'easeInOutCubic', () => {
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

            if (!this.noMarker) {
                this.items.forEach(item => {
                    item.css({ opacity: this.props.yMultiplier });
                });
            }
        });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
