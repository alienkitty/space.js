/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

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
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.height = this.width / 2;
        this.range = this.getRange(this.range);

        if (Array.isArray(this.value)) {
            if (!this.callback) {
                this.points = value;
            } else {
                this.points = value.slice();
            }
        } else {
            this.points = new Array(this.resolution).fill(0);
        }

        this.length = this.points.length;

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

        this.init();
        this.initGraph();
    }

    init() {
        this.css({
            position: 'relative',
            height: this.height
        });

        this.container = new Interface('.container');
        this.container.css({
            height: 20,
            whiteSpace: 'nowrap'
        });
        this.add(this.container);

        this.content = new Interface('.content');
        this.content.css({
            cssFloat: 'left',
            marginRight: 10,
            lineHeight: 20,
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
                lineHeight: 20,
                letterSpacing: 'var(--ui-number-letter-spacing)'
            });
            this.container.add(this.number);
        }
    }

    initGraph() {
        this.graph = new Interface(null, 'svg');
        this.graph.hide();
        this.graph.attr({
            viewBox: `0 0 ${this.length} ${this.height}`,
            width: this.length,
            height: this.height,
            preserveAspectRatio: 'none'
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
            strokeWidth: 1.5,
            vectorEffect: 'non-scaling-stroke'
        });
        this.graph.add(this.graph.path);

        this.add(this.graph);
    }

    createPath(points) {
        let path = '';

        for (let i = 0, l = points.length - 1; i < l; i++) {
            const x1 = i;
            const x2 = i + 1;
            const y1 = this.height - points[i] * this.range - 1;
            const y2 = this.height - points[i + 1] * this.range - 1;
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
                    this.range = this.getRange(660);
                } else if (this.delta < this.refreshRate120) {
                    this.range = this.getRange(330);
                } else {
                    this.range = this.getRange(165);
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

    update(value) {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                this.points = value.slice();
            } else {
                this.points.shift();
                this.points.push(value);
            }
        }

        this.graph.path.attr({ d: this.createPath(this.points) });
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
