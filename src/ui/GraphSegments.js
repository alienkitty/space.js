/**
 * @author pschroen / https://ufo.ai/
 */

import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Easing } from '../tween/Easing.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { GraphMarker } from './GraphMarker.js';

import { ticker } from '../tween/Ticker.js';
import { clearTween, delayedCall, tween } from '../tween/Tween.js';
import { clamp, mapLinear } from '../utils/Utils.js';

export class GraphSegments extends Interface {
    constructor({
        width = 300,
        height = 50,
        resolution = 80,
        precision = 0,
        lookupPrecision = 0,
        segments = [],
        markers = [],
        range = 1,
        value,
        ghost,
        noHover = false,
        noMarker = false,
        noGradient = false
    } = {}) {
        super('.graph-segments');

        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.segments = segments;
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
        this.graphs = [];
        this.bounds = null;
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.mouseX = 0;
        this.items = [];
        this.isDragging = false;
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
            this.initGraphs();
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
            userSelect: 'none',
            touchAction: 'none'
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

    initGraphs() {
        // Not added to DOM
        this.graphs = this.segments.map(() => {
            const graph = new Interface(null, 'svg');
            graph.path = new Interface(null, 'svg', 'path');
            graph.add(graph.path);

            graph.pathData = '';
            graph.length = 0;
            graph.lookup = [];

            return graph;
        });
    }

    calculateLookup(graph) {
        graph.length = graph.path.element.getTotalLength();
        graph.lookup = [];

        let i = 0;

        while (i <= 1) {
            graph.lookup.push(graph.path.element.getPointAtLength(i * graph.length));

            i += 1 / this.lookupPrecision;
        }
    }

    getCurveY(graph, mouseX, width) {
        const x = mouseX * width;
        const approxIndex = Math.floor(mouseX * this.lookupPrecision);

        let i = Math.max(1, approxIndex - Math.floor(this.lookupPrecision / 3));

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

        if (!this.noMarker && navigator.maxTouchPoints) {
            this.element.addEventListener('contextmenu', this.onContextMenu);
        }
    }

    removeListeners() {
        if (!this.noHover) {
            this.element.removeEventListener('mouseenter', this.onHover);
            this.element.removeEventListener('mouseleave', this.onHover);
            window.removeEventListener('pointerdown', this.onPointerDown);
            window.removeEventListener('pointermove', this.onPointerMove);
        }

        if (!this.noMarker && navigator.maxTouchPoints) {
            this.element.removeEventListener('contextmenu', this.onContextMenu);
        }

        this.items.forEach(item => {
            item.events.off('update', this.onMarkerUpdate);
            item.events.off('click', this.onMarkerClick);
        });
    }

    getRangeHeight(range) {
        if (Array.isArray(range)) {
            return range.map(range => (this.height - 5) / range);
        } else {
            return new Array(this.segments.length).fill((this.height - 5) / range);
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

            this.hoverIn();
        } else {
            this.hoverOut();
        }
    };

    onPointerMove = e => {
        const event = {
            x: e.clientX,
            y: e.clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);

        this.bounds = this.element.getBoundingClientRect();
        this.mouseX = clamp((this.mouse.x - this.bounds.left) / this.width, 0, 1);
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        this.onClick(e);
    };

    onContextMenu = e => {
        e.preventDefault();

        this.onClick(e);
    };

    onClick = e => {
        if (e.target !== this.element) {
            return;
        }

        if (this.items.find(item => item.x === this.mouseX)) {
            return;
        }

        this.addMarker([this.mouseX, this.getMarkerName()]);
    };

    onMarkerUpdate = ({ dragging, target }) => {
        this.isDragging = dragging;

        if (this.isDragging) {
            target.x = this.mouseX;
        }
    };

    onMarkerClick = e => {
        console.log('onMarkerClick', e);
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

        if (!this.noHover && this.lookupPrecision) {
            this.graphs.forEach(graph => {
                graph.pathData = '';
            });

            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    addMarker([x, name], delay = 0) {
        const item = new GraphMarker({ name });
        item.css({ top: -12 });
        item.x = x;
        item.multiplier = 0;
        item.events.on('update', this.onMarkerUpdate);
        item.events.on('click', this.onMarkerClick);
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

        if (this.needsUpdate || this.hoveredIn || this.isDragging) {
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

        // Draw segment lines
        let end = 0;

        for (let i = 0, l = this.array.length, il = this.segments.length - 1; i < il; i++) {
            end += this.segments[i] / l;

            const x = end * this.width;

            this.context.beginPath();
            this.context.moveTo(x, h - 0.5);
            this.context.lineTo(x, h - 0.5 - (h - 0.5) * this.props.yMultiplier);
            this.context.stroke();
        }

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
                const x = clamp(this.items[i].x * this.width, 0.5, this.width - 0.5);

                this.context.beginPath();
                this.context.moveTo(x, h - 0.5);
                this.context.lineTo(x, h - 0.5 - (h - 0.5) * this.items[i].multiplier * this.props.yMultiplier);
                this.context.stroke();
            }

            this.items.forEach(item => {
                item.css({ left: clamp(item.x * this.width, 0.5, this.width - 0.5) });
            });
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
            const segmentsLength = this.segments.length;

            let i = 0;
            let start = 0;
            let width = 0;
            let end = 0;

            for (; i < segmentsLength; i++) {
                start = end;
                width = this.segments[i] / length;
                end += width;

                if (this.mouseX >= start && this.mouseX <= end) {
                    break;
                }
            }

            if (i === segmentsLength) {
                i = segmentsLength - 1;
            }

            const mouseX = clamp(mapLinear(this.mouseX, start, end, 0, 1), 0, 1);
            let index = Math.floor(start * length + mouseX * this.segments[i]);

            if (index === length) {
                index = length - 1;
            }

            const value = this.array[index];
            const x = clamp(this.mouseX * this.width, 0.5, this.width - 0.5);

            let y;

            if (this.lookupPrecision) {
                y = this.getCurveY(this.graphs[i], mouseX, width * this.width) - 1;
            } else {
                y = h - value * this.rangeHeight[i] - 1;
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

        let end = 0;

        for (let i = 0, l = array.length, il = this.segments.length; i < il; i++) {
            if (this.props.progress === 1) {
                this.context.beginPath();
            }

            const start = end;
            end += this.segments[i];

            const startX = (start / l) * this.width;
            const endX = (end / l) * this.width;
            const segmentWidth = (this.segments[i] / l) * this.width;

            for (let j = 0, jl = this.segments[i]; j < jl - 1; j++) {
                const x0 = (j / (jl - 1)) * segmentWidth;
                const x1 = ((j + 1) / (jl - 1)) * segmentWidth;
                const y0 = array[start + j] * this.rangeHeight[i];
                const y1 = array[start + j + 1] * this.rangeHeight[i];
                const mx = (x0 + x1) / 2;
                const my = (y0 + y1) / 2;
                const cpx0 = (mx + x0) / 2;
                const cpx1 = (mx + x1) / 2;

                if (j === 0) {
                    if (this.graphNeedsUpdate && !ghost) {
                        this.graphs[i].pathData += `M ${x0} ${h - y0}`;
                    }

                    if (this.props.progress === 1) {
                        this.context.moveTo(startX + x0, h - y0 * this.props.yMultiplier - 1);
                    }
                }

                if (this.graphNeedsUpdate && !ghost) {
                    this.graphs[i].pathData += ` Q ${cpx0} ${h - y0} ${mx} ${h - my} Q ${cpx1} ${h - y1} ${x1} ${h - y1}`;
                }

                if (this.props.progress === 1) {
                    this.context.quadraticCurveTo(startX + cpx0, h - y0 * this.props.yMultiplier - 1, startX + mx, h - my * this.props.yMultiplier - 1);
                    this.context.quadraticCurveTo(startX + cpx1, h - y1 * this.props.yMultiplier - 1, startX + x1, h - y1 * this.props.yMultiplier - 1);
                }
            }

            if (this.props.progress === 1) {
                this.context.stroke();

                // Draw linear gradient fill
                if (!this.noGradient) {
                    this.context.shadowBlur = 0;
                    this.context.lineTo(endX, this.height);
                    this.context.lineTo(startX, this.height);
                    this.context.fill();
                }
            }
        }

        if (this.props.progress < 1) {
            this.context.beginPath();
            this.context.moveTo(0, h);
            this.context.lineTo(w, h);
            this.context.stroke();
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
