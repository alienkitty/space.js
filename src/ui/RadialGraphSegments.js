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
import { TwoPI, degToRad, mapLinear } from '../utils/Utils.js';

/**
 * Radial graph with segments.
 * @example
 * const graph = new RadialGraphSegments({
 *     value: Array.from({ length: 10 }, () => Math.random()),
 *     precision: 2,
 *     lookupPrecision: 100, // per segment
 *     segments: [5, 5] // length of each segment (minimum length of 2)
 * });
 * graph.animateIn();
 * document.body.appendChild(graph.element);
 *
 * function animate() {
 *     requestAnimationFrame(animate);
 *
 *     graph.update();
 * }
 *
 * requestAnimationFrame(animate);
 */
export class RadialGraphSegments extends Interface {
    constructor({
        value,
        ghost,
        width = 300,
        height = 300,
        start = 0,
        graphHeight = 60,
        resolution = 80,
        tension = 6,
        precision = 0,
        lookupPrecision = 0,
        textDistanceX = 20,
        textDistanceY = 10,
        segments = [],
        ratio = [],
        markers = [],
        range = 1,
        suffix = '',
        noHover = false,
        noMarker = false,
        noMarkerDrag = false,
        noGradient = false
    } = {}) {
        super('.radial-graph-segments');

        this.value = value;
        this.ghost = ghost;
        this.width = width;
        this.height = height;
        this.start = start;
        this.graphHeight = graphHeight;
        this.resolution = resolution;
        this.tension = tension;
        this.precision = precision;
        this.lookupPrecision = lookupPrecision;
        this.textDistanceX = textDistanceX;
        this.textDistanceY = textDistanceY;
        this.segments = segments;
        this.ratio = ratio;
        this.markers = markers;
        this.range = range;
        this.suffix = suffix;
        this.noHover = noHover;
        this.noMarker = noMarker;
        this.noMarkerDrag = noMarkerDrag;
        this.noGradient = noGradient;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.startTime = performance.now();
        this.frame = 0;

        this.middle = 0;
        this.radius = 0;
        this.distance = 0;
        this.segmentsRatio = [];
        this.rangeHeight = [];
        this.startAngle = degToRad(this.start);
        this.array = [];
        this.ghostArray = [];
        this.points = [];
        this.graphs = [];
        this.bounds = null;
        this.offset = new Vector2();
        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.mouseAngle = 0;
        this.lastHover = 'out';
        this.lastCursor = '';
        this.items = [];
        this.mobileOffset = navigator.maxTouchPoints ? -50 : 0; // Position above finger
        this.isDragging = false;
        this.isDraggingAway = false;
        this.animatedIn = false;
        this.hoveredIn = false;
        this.needsUpdate = false;
        this.graphNeedsUpdate = false;
        this.initialized = false;

        if (this.startAngle < 0) {
            this.startAngle += TwoPI;
        }

        if (!Array.isArray(this.lookupPrecision)) {
            this.lookupPrecision = new Array(this.segments.length).fill(this.lookupPrecision);
        }

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
            yMultiplier: 0,
            progress: 0
        };

        this.handleProps = {
            alpha: 0
        };

        this.init();
        this.initCanvas();

        if (!this.noHover && this.lookupPrecision) {
            this.initGraphs();
        }

        if (!this.noMarker) {
            this.initMarkers();
        }

        this.setArray(this.value);

        if (this.ghost !== undefined) {
            this.setGhostArray(this.ghost);
        }

        this.setSize(this.width, this.height);
    }

    init() {
        this.css({
            position: 'relative',
            width: this.width,
            height: this.height,
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
                top: 0,
                transform: 'translate(-50%, -50%)',
                fontSize: 'const(--ui-secondary-font-size)',
                letterSpacing: 'const(--ui-secondary-letter-spacing)',
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0
            });
            this.add(this.info);
        }
    }

    initGraphs() {
        // Not added to DOM
        this.graphs = this.segments.map((length, i) => {
            const graph = new Interface(null, 'svg');
            graph.path = new Interface(null, 'svg', 'path');
            graph.add(graph.path);

            graph.pathData = '';
            graph.length = 0;
            graph.lookup = [];
            graph.lookupPrecision = this.lookupPrecision[i];

            return graph;
        });
    }

    calculateLookup(graph) {
        graph.length = graph.path.element.getTotalLength();
        graph.lookup = [];

        let i = 0;

        while (i <= 1) {
            const point = graph.path.element.getPointAtLength(i * graph.length);
            const x = point.x - this.middle;
            const y = point.y - this.middle;

            let angle = (-this.startAngle + Math.atan2(y, x)) % TwoPI;

            if (angle < 0) {
                angle += TwoPI;
            }

            graph.lookup.push({
                x: point.x,
                y: point.y,
                angle
            });

            i += 1 / graph.lookupPrecision;
        }
    }

    getCurvePoint(graph, mouseAngle, slice) {
        const angle = mouseAngle * TwoPI;
        const approxIndex = Math.floor(mouseAngle * slice * graph.lookupPrecision);

        let i = Math.max(1, approxIndex - Math.floor(graph.lookupPrecision / 3));

        for (; i < graph.lookupPrecision; i++) {
            if (graph.lookup[i].angle > angle) {
                break;
            }
        }

        if (i === graph.lookupPrecision) {
            const x = graph.lookup[graph.lookupPrecision - 1].x;
            const y = graph.lookup[graph.lookupPrecision - 1].y;

            return { x, y };
        }

        const lower = graph.lookup[i - 1];
        const upper = graph.lookup[i];
        const percent = (angle - lower.angle) / (upper.angle - lower.angle);
        const diffX = upper.x - lower.x;
        const diffY = upper.y - lower.y;
        const x = lower.x + diffX * percent;
        const y = lower.y + diffY * percent;

        return { x, y };
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

    createGradient(x0, y0, r0, x1, y1, r1, alpha = 1) {
        this.alpha = alpha;

        const gradient = this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);

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
        this.markers.forEach(data => {
            this.addMarker(data);
        });
    }

    addListeners() {
        if (!this.noHover) {
            window.addEventListener('pointerdown', this.onPointerDown);
            window.addEventListener('pointermove', this.onPointerMove);
        }

        this.items.forEach(item => {
            item.events.on('update', this.onMarkerUpdate);
            item.events.on('click', this.onMarkerClick);
        });
    }

    removeListeners() {
        if (!this.noHover) {
            window.removeEventListener('pointerdown', this.onPointerDown);
            window.removeEventListener('pointermove', this.onPointerMove);
        }

        this.items.forEach(item => {
            item.events.off('update', this.onMarkerUpdate);
            item.events.off('click', this.onMarkerClick);
        });
    }

    getSegmentsRatio(ratio) {
        if (ratio.length) {
            return this.segments.map((length, i) => (this.array.length * ratio[i]) / length);
        } else {
            return this.segments.map(() => 1);
        }
    }

    getRangeHeight(range) {
        if (Array.isArray(range)) {
            return range.map(range => (this.graphHeight - 5) / range);
        } else {
            return new Array(this.segments.length).fill((this.graphHeight - 5) / range);
        }
    }

    // Event handlers

    onPointerDown = e => {
        this.lastTime = performance.now();
        this.lastMouse.set(e.clientX, e.clientY);

        this.onPointerMove(e);

        window.addEventListener('pointerup', this.onPointerUp);
    };

    onPointerMove = e => {
        const event = {
            x: e.clientX,
            y: e.clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);

        this.bounds = this.element.getBoundingClientRect();
        this.offset.x = this.mouse.x - (this.bounds.left + this.middle);
        this.offset.y = this.mouse.y - (this.bounds.top + this.middle);

        const distance = this.offset.length();
        const angle = this.offset.angle();

        this.mouseAngle = angle / TwoPI;

        if (distance > this.distance && distance < this.middle) {
            this.setHover('over');
            this.setCursor('crosshair');
        } else {
            this.setHover();
            this.setCursor();
        }
    };

    onPointerUp = e => {
        window.removeEventListener('pointerup', this.onPointerUp);

        if (e.target !== this.element) {
            return;
        }

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        if (this.items.find(item => item.angle === this.mouseAngle)) {
            return;
        }

        if (!this.noMarker && !this.noMarkerDrag) {
            this.addMarker([this.mouseAngle, this.getMarkerName()]);
        }
    };

    onMarkerUpdate = ({ dragging, target }) => {
        this.isDragging = dragging;
        this.isDraggingAway = this.offset.length() > this.middle + 50;

        if (this.isDragging && this.isDraggingAway) {
            this.origin.subVectors(this.mouse, this.bounds);

            target.css({ left: this.origin.x, top: this.origin.y + this.mobileOffset });

            if (this.hoveredIn) {
                this.hoverOut();
            }
        } else if (this.isDragging) {
            target.angle = this.mouseAngle;
        } else if (this.isDraggingAway) {
            this.isDraggingAway = false;

            this.removeMarker(target);
        }

        this.needsUpdate = true;
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

    setHover(type = 'out') {
        if (this.isDraggingAway) {
            return;
        }

        if (type !== this.lastHover) {
            this.lastHover = type;

            if (!this.animatedIn) {
                if (type === 'over') {
                    this.hoveredIn = true;
                } else {
                    this.hoveredIn = false;
                }

                return;
            }

            clearTween(this.timeout);

            if (type === 'over') {
                this.hoverIn();
            } else {
                this.timeout = delayedCall(200, () => {
                    this.hoverOut();
                });
            }
        }
    }

    setCursor(cursor = '') {
        if (cursor !== this.lastCursor) {
            this.lastCursor = cursor;

            this.css({ cursor });
        }
    }

    setArray(value) {
        if (Array.isArray(value)) {
            this.array = value;
        } else {
            this.array = new Array(this.resolution).fill(0);
        }

        this.segmentsRatio = this.getSegmentsRatio(this.ratio);

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision) {
            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    setGhostArray(value) {
        if (Array.isArray(value)) {
            this.ghostArray = value;
        } else {
            this.ghostArray = new Array(this.array.length).fill(0);
        }

        this.needsUpdate = true;

        this.update();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.middle = this.width / 2;
        this.radius = this.middle - this.graphHeight;
        this.distance = this.radius - this.graphHeight;
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

        this.strokeStyle = this.createGradient(this.middle, this.middle, this.radius, this.middle, this.middle, this.middle);
        this.fillStyle = this.createGradient(this.middle, this.middle, this.radius, this.middle, this.middle, this.middle, 0.07);

        this.needsUpdate = true;

        if (!this.noHover && this.lookupPrecision) {
            this.graphNeedsUpdate = true;
        }

        this.update();
    }

    addMarker([angle, name]) {
        const item = new GraphMarker({ name, noDrag: this.noMarkerDrag });
        item.angle = angle;
        item.multiplier = 0;
        this.add(item);

        this.items.push(item);

        if (this.initialized) {
            item.events.on('update', this.onMarkerUpdate);
            item.events.on('click', this.onMarkerClick);

            tween(item, { multiplier: 1 }, 400, 'easeOutCubic', null, () => {
                this.needsUpdate = true;

                item.css({ opacity: item.multiplier });
            });

            Stage.events.emit('marker', { type: 'add', item, target: this });
        }
    }

    removeMarker(marker) {
        const index = this.items.indexOf(marker);

        if (~index) {
            const item = this.items.splice(index, 1)[0];

            Stage.events.emit('marker', { type: 'remove', item, target: this });

            item.destroy();
        }
    }

    update(value) {
        if (!ticker.isAnimating && ++this.frame > ticker.frame) {
            ticker.onTick(performance.now() - this.startTime);
        }

        if (value !== undefined) {
            if (Array.isArray(value)) {
                this.setArray(value);
            } else {
                if (this.ghost !== undefined) {
                    const ghost = this.array.pop();
                    this.array.unshift(value);
                    this.ghostArray.pop();
                    this.ghostArray.unshift(ghost);
                } else {
                    this.array.pop();
                    this.array.unshift(value);
                }

                this.needsUpdate = true;

                if (!this.noHover && this.lookupPrecision) {
                    this.graphNeedsUpdate = true;
                }
            }
        }

        if (this.needsUpdate || this.hoveredIn || this.isDragging) {
            this.drawGraph();
            this.needsUpdate = false;
        }
    }

    drawGraph() {
        if (this.props.alpha <= 0) {
            return;
        }

        const h = this.graphHeight - 1;

        if (this.props.alpha < 0.001) {
            this.context.globalAlpha = 0;
        } else {
            this.context.globalAlpha = this.props.alpha;
        }

        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        // Draw inner circle
        this.context.lineWidth = 1;
        this.context.strokeStyle = this.lineColors.bottom;

        this.context.beginPath();
        this.context.arc(this.middle, this.middle, this.middle - h, this.startAngle, this.startAngle + TwoPI * this.props.progress);
        this.context.stroke();

        // Draw segment lines
        let end = 0;

        for (let i = 0, l = this.array.length, il = this.segments.length; i < il; i++) {
            end += (this.segments[i] / l) * this.segmentsRatio[i];

            const angle = this.startAngle + end * TwoPI;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const r0 = this.middle - (h - 0.5);
            const r1 = this.middle - (h - 0.5 - (h - 0.5) * this.props.yMultiplier);
            const x0 = this.middle + r0 * c;
            const y0 = this.middle + r0 * s;
            const x1 = this.middle + r1 * c;
            const y1 = this.middle + r1 * s;

            this.context.beginPath();
            this.context.moveTo(x0, y0);
            this.context.lineTo(x1, y1);
            this.context.stroke();
        }

        // Draw graph line and radial gradient fill
        if (this.ghostArray.length) {
            this.drawPath(h, this.ghostArray, true);
        }

        if (this.array.length) {
            this.drawPath(h, this.array);
        }

        // Draw marker lines
        if (!this.noMarker) {
            this.context.lineWidth = 1.5;
            this.context.strokeStyle = this.lineColors.graph;

            for (let i = 0, l = this.items.length; i < l; i++) {
                const mouseAngle = this.items[i].angle;
                const textDistanceX = this.items[i].width / 2 + 10;

                let textOffset;

                if (mouseAngle >= 0 && mouseAngle < 0.25) {
                    textOffset = mapLinear(mouseAngle, 0, 0.25, textDistanceX, this.textDistanceY);
                } else if (mouseAngle >= 0.25 && mouseAngle < 0.5) {
                    textOffset = mapLinear(mouseAngle, 0.25, 0.5, this.textDistanceY, textDistanceX);
                } else if (mouseAngle >= 0.5 && mouseAngle < 0.75) {
                    textOffset = mapLinear(mouseAngle, 0.5, 0.75, textDistanceX, this.textDistanceY);
                } else if (mouseAngle >= 0.75 && mouseAngle <= 1) {
                    textOffset = mapLinear(mouseAngle, 0.75, 1, this.textDistanceY, textDistanceX);
                }

                const angle = mouseAngle * TwoPI;
                const c = Math.cos(angle);
                const s = Math.sin(angle);
                const r0 = this.middle - (h - 0.5);
                const r1 = this.middle - (h - 0.5 - (h - 0.5) * this.items[i].multiplier * this.props.yMultiplier);
                const r2 = this.middle + textOffset;
                const x0 = this.middle + r0 * c;
                const y0 = this.middle + r0 * s;
                const x1 = this.middle + r1 * c;
                const y1 = this.middle + r1 * s;
                const x2 = this.middle + r2 * c;
                const y2 = this.middle + r2 * s;

                this.context.beginPath();
                this.context.moveTo(x0, y0);
                this.context.lineTo(x1, y1);
                this.context.stroke();

                if (!this.isDraggingAway) {
                    this.items[i].css({ left: x2, top: y2 });
                }
            }
        }

        // Draw handle line and circle
        if (!this.noHover && !this.isDraggingAway) {
            if (this.graphNeedsUpdate) {
                this.graphs.forEach(graph => {
                    graph.path.attr({ d: graph.pathData });
                    this.calculateLookup(graph);
                });

                this.graphNeedsUpdate = false;
            }

            let angle = (-this.startAngle + Math.atan2(this.offset.y, this.offset.x)) % TwoPI;

            if (angle < 0) {
                angle += TwoPI;
            }

            const length = this.array.length;
            const segmentsLength = this.segments.length;
            const mouseAngle = angle / TwoPI;

            let i = 0;
            let start = 0;
            let slice = 0;
            let end = 0;
            let startAngle = 0;
            let endAngle = 0;

            for (; i < segmentsLength; i++) {
                start = end;
                slice = this.segments[i] / length;
                end += slice;
                startAngle = endAngle;
                endAngle += slice * this.segmentsRatio[i];

                if (mouseAngle >= startAngle && mouseAngle <= endAngle) {
                    break;
                }
            }

            if (i === segmentsLength) {
                i = segmentsLength - 1;
            }

            const segmentAngle = mapLinear(mouseAngle, startAngle, endAngle, 0, 1);
            const value = this.array[Math.floor(start * length + segmentAngle * this.segments[i])];

            let radius;

            if (this.graphs[i].lookupPrecision) {
                const point = this.getCurvePoint(this.graphs[i], mouseAngle, slice * this.segmentsRatio[i]);
                const x = point.x - this.middle;
                const y = point.y - this.middle;
                const distance = Math.sqrt(x * x + y * y);

                radius = this.middle - (h - (distance - this.radius) - 1);
            } else {
                radius = this.middle - (h - value * this.rangeHeight[i] - 1);
            }

            let textOffset;

            if (this.mouseAngle >= 0 && this.mouseAngle < 0.25) {
                textOffset = mapLinear(this.mouseAngle, 0, 0.25, this.textDistanceX, this.textDistanceY);
            } else if (this.mouseAngle >= 0.25 && this.mouseAngle < 0.5) {
                textOffset = mapLinear(this.mouseAngle, 0.25, 0.5, this.textDistanceY, this.textDistanceX);
            } else if (this.mouseAngle >= 0.5 && this.mouseAngle < 0.75) {
                textOffset = mapLinear(this.mouseAngle, 0.5, 0.75, this.textDistanceX, this.textDistanceY);
            } else if (this.mouseAngle >= 0.75 && this.mouseAngle <= 1) {
                textOffset = mapLinear(this.mouseAngle, 0.75, 1, this.textDistanceY, this.textDistanceX);
            }

            angle = this.mouseAngle * TwoPI;

            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const r0 = this.radius - textOffset;
            const r1 = this.radius;
            const r2 = radius - 2;
            const r3 = radius;
            const x0 = this.middle + r0 * c;
            const y0 = this.middle + r0 * s;
            const x1 = this.middle + r1 * c;
            const y1 = this.middle + r1 * s;
            const x2 = this.middle + r2 * c;
            const y2 = this.middle + r2 * s;
            const x3 = this.middle + r3 * c;
            const y3 = this.middle + r3 * s;

            if (this.handleProps.alpha < 0.001) {
                this.context.globalAlpha = 0;
            } else {
                this.context.globalAlpha = this.handleProps.alpha;
            }

            this.context.lineWidth = 1;
            this.context.strokeStyle = this.lineColors.handle;

            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(x3, y3, 2.5, 0, TwoPI);
            this.context.stroke();

            this.info.css({ left: x0, top: y0 });
            this.info.text(`${value.toFixed(this.precision)}${this.suffix}`);
        }
    }

    drawPath(h, array, ghost) {
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

        if (!this.noHover && this.graphNeedsUpdate && !ghost) {
            let end = 0;
            let endAngle = 0;

            for (let i = 0, l = array.length, il = this.segments.length; i < il; i++) {
                const start = end;
                end += this.segments[i];

                const startAngle = endAngle;
                const segmentSlice = (this.segments[i] / l) * this.segmentsRatio[i] * TwoPI;
                endAngle += segmentSlice;

                this.points.length = 0;

                for (let j = 0, jl = this.segments[i]; j < jl; j++) {
                    const radius = this.middle - (this.graphHeight - array[start + j] * this.rangeHeight[i]);

                    if (j === 0) {
                        const rad0 = this.startAngle + startAngle + segmentSlice * ((j - 1) / (jl - 1));
                        const rad1 = this.startAngle + startAngle;

                        this.points[j] = {
                            x: this.middle + radius * Math.cos(rad0),
                            y: this.middle + radius * Math.sin(rad0)
                        };

                        this.points[j + 1] = {
                            x: this.middle + radius * Math.cos(rad1),
                            y: this.middle + radius * Math.sin(rad1)
                        };
                    } else if (j !== jl - 1) {
                        const rad = this.startAngle + startAngle + segmentSlice * (j / (jl - 1));

                        this.points[j + 1] = {
                            x: this.middle + radius * Math.cos(rad),
                            y: this.middle + radius * Math.sin(rad)
                        };
                    } else if (j === jl - 1) {
                        const rad0 = this.startAngle + startAngle + segmentSlice;
                        const rad1 = this.startAngle + startAngle + segmentSlice * ((j + 1) / (jl - 1));

                        this.points[j + 1] = {
                            x: this.middle + radius * Math.cos(rad0),
                            y: this.middle + radius * Math.sin(rad0)
                        };

                        this.points[j + 2] = {
                            x: this.middle + radius * Math.cos(rad1),
                            y: this.middle + radius * Math.sin(rad1)
                        };
                    }
                }

                this.graphs[i].pathData = `M ${this.points[1].x} ${this.points[1].y}`;

                for (let j = 1, jl = this.points.length; j < jl - 2; j++) {
                    const p0 = this.points[j - 1];
                    const p1 = this.points[j];
                    const p2 = this.points[j + 1];
                    const p3 = this.points[j + 2];

                    const cp1x = p1.x + (p2.x - p0.x) / this.tension;
                    const cp1y = p1.y + (p2.y - p0.y) / this.tension;

                    const cp2x = p2.x - (p3.x - p1.x) / this.tension;
                    const cp2y = p2.y - (p3.y - p1.y) / this.tension;

                    this.graphs[i].pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
                }
            }
        }

        let end = 0;
        let endAngle = 0;

        for (let i = 0, l = array.length, il = this.segments.length; i < il; i++) {
            const start = end;
            end += this.segments[i];

            const startAngle = endAngle;
            const segmentSlice = (this.segments[i] / l) * this.segmentsRatio[i] * TwoPI;
            endAngle += segmentSlice;

            this.points.length = 0;

            // Close loop smoothly by repeating the first and last values
            for (let j = 0, jl = this.segments[i]; j < jl; j++) {
                const radius = this.middle - (h - array[start + j] * this.rangeHeight[i] * this.props.yMultiplier - 1);

                if (j === 0) {
                    const rad0 = this.startAngle + startAngle + segmentSlice * ((j - 1) / (jl - 1));
                    const rad1 = this.startAngle + startAngle;

                    this.points[j] = {
                        x: this.middle + radius * Math.cos(rad0),
                        y: this.middle + radius * Math.sin(rad0)
                    };

                    this.points[j + 1] = {
                        x: this.middle + radius * Math.cos(rad1),
                        y: this.middle + radius * Math.sin(rad1)
                    };
                } else if (j !== jl - 1) {
                    const rad = this.startAngle + startAngle + segmentSlice * (j / (jl - 1));

                    this.points[j + 1] = {
                        x: this.middle + radius * Math.cos(rad),
                        y: this.middle + radius * Math.sin(rad)
                    };
                } else if (j === jl - 1) {
                    const rad0 = this.startAngle + startAngle + segmentSlice;
                    const rad1 = this.startAngle + startAngle + segmentSlice * ((j + 1) / (jl - 1));

                    this.points[j + 1] = {
                        x: this.middle + radius * Math.cos(rad0),
                        y: this.middle + radius * Math.sin(rad0)
                    };

                    this.points[j + 2] = {
                        x: this.middle + radius * Math.cos(rad1),
                        y: this.middle + radius * Math.sin(rad1)
                    };
                }
            }

            // Close loop smoothly with the first and last control points
            if (this.props.progress === 1) {
                this.context.beginPath();
                this.context.moveTo(this.points[1].x, this.points[1].y);

                for (let j = 1, jl = this.points.length; j < jl - 2; j++) {
                    const p0 = this.points[j - 1];
                    const p1 = this.points[j];
                    const p2 = this.points[j + 1];
                    const p3 = this.points[j + 2];

                    const cp1x = p1.x + (p2.x - p0.x) / this.tension;
                    const cp1y = p1.y + (p2.y - p0.y) / this.tension;

                    const cp2x = p2.x - (p3.x - p1.x) / this.tension;
                    const cp2y = p2.y - (p3.y - p1.y) / this.tension;

                    this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }

                this.context.stroke();

                // Draw radial gradient fill
                if (!this.noGradient) {
                    const radius = this.middle - h;
                    const x0 = this.middle + radius * Math.cos(this.startAngle + endAngle);
                    const y0 = this.middle + radius * Math.sin(this.startAngle + endAngle);
                    const x1 = this.middle + radius * Math.cos(this.startAngle + startAngle);
                    const y1 = this.middle + radius * Math.sin(this.startAngle + startAngle);

                    this.context.shadowBlur = 0;
                    this.context.lineTo(x0, y0);
                    this.context.lineTo(x1, y1);
                    this.context.fill();
                }
            }
        }

        // Inner circle hole
        if (this.props.progress === 1) {
            this.context.save();
            this.context.fillStyle = '#000';
            this.context.globalCompositeOperation = 'destination-out';
            this.context.beginPath();
            this.context.arc(this.middle, this.middle, this.radius, 0, TwoPI);
            this.context.fill();
            this.context.restore();
        } else {
            this.context.beginPath();
            this.context.arc(this.middle, this.middle, this.middle - h, this.startAngle, this.startAngle + TwoPI * this.props.progress);
            this.context.stroke();
        }
    }

    hoverIn() {
        clearTween(this.handleProps);

        tween(this.handleProps, { alpha: 1 }, 275, 'easeInOutCubic', null, () => {
            this.needsUpdate = true;
        });

        this.info.clearTween();
        this.info.visible();
        this.info.tween({ opacity: 1 }, 275, 'easeInOutCubic');

        this.hoveredIn = true;
    }

    hoverOut(fast) {
        this.lastHover = 'out';

        clearTween(this.handleProps);

        this.info.clearTween();

        if (fast) {
            this.handleProps.alpha = 0;
            this.needsUpdate = true;

            this.info.css({ opacity: 0 });
            this.info.invisible();
        } else {
            tween(this.handleProps, { alpha: 0 }, 275, 'easeInOutCubic', null, () => {
                this.needsUpdate = true;
            });

            this.info.tween({ opacity: 0 }, 275, 'easeInOutCubic', () => {
                this.info.invisible();
            });
        }

        this.hoveredIn = false;
    }

    animateIn(fast) {
        this.addListeners();

        clearTween(this.props);

        if (!this.initialized) {
            this.initialized = true;

            this.update();
        }

        if (fast) {
            this.props.alpha = 1;
            this.props.yMultiplier = 1;
            this.props.progress = 1;

            this.animatedIn = true;
            this.needsUpdate = true;

            this.update();

            if (this.hoveredIn) {
                this.hoverIn();
            }
        } else {
            this.props.alpha = 0;
            this.props.yMultiplier = 0;
            this.props.progress = 0;

            tween(this.props, { alpha: 1 }, 500, 'easeOutSine');

            tween(this.props, { progress: 1 }, 500, 'easeInOutCubic', () => {
                tween(this.props, { yMultiplier: 1 }, 400, 'easeOutCubic', () => {
                    this.animatedIn = true;

                    if (this.hoveredIn) {
                        this.hoverIn();
                    }

                    if (!this.noMarker) {
                        this.items.forEach(item => {
                            tween(item, { multiplier: 1 }, 400, 'easeOutCubic', null, () => {
                                this.needsUpdate = true;

                                item.css({ opacity: item.multiplier });
                            });
                        });
                    }
                }, () => {
                    this.needsUpdate = true;
                });
            }, () => {
                this.needsUpdate = true;
            });
        }
    }

    animateOut() {
        this.removeListeners();

        clearTween(this.props);

        this.animatedIn = false;

        this.hoverOut(true);
        this.setCursor();

        tween(this.props, { alpha: 0 }, 300, 'easeOutSine');

        tween(this.props, { yMultiplier: 0 }, 300, 'easeOutCubic', null, () => {
            this.needsUpdate = true;

            if (!this.noMarker) {
                this.items.forEach(item => {
                    item.multiplier = this.props.yMultiplier;

                    item.css({ opacity: item.multiplier });
                });
            }
        });
    }

    destroy() {
        this.removeListeners();

        clearTween(this.props);

        return super.destroy();
    }
}
