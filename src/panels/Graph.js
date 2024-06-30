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
        resolution = 40,
        precision = 0,
        range = 165,
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
        this.range = (1 / this.range) * 49;

        if (Array.isArray(this.value)) {
            if (!this.callback) {
                this.points = value;
            } else {
                this.points = value.slice();
            }
        } else {
            this.points = new Array(this.resolution + 1).fill(50);
        }

        if (this.value === undefined) {
            this.count = 0;
            this.time = 0;
            this.prev = 0;
            this.fps = 0;
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
            viewBox: `0 0 ${this.resolution} ${50}`,
            width: this.resolution,
            height: 50,
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

    createPath(point) {
        let p = '';

        p += 'M ' + -1 + ' ' + 50;

        for (let i = 0; i < this.resolution + 1; i++) {
            p += ' L ' + i + ' ' + point[i];
        }

        p += ' L ' + (this.resolution + 1) + ' ' + 50;

        return p;
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    onUpdate = () => {
        if (this.value === undefined) {
            this.time = performance.now();

            if (this.time - 1000 > this.prev) {
                this.prev = this.time;
                this.fps = this.count;
                this.count = 0;
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
                this.points.push(50 - value * this.range);
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
