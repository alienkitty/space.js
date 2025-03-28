/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/lo-th/uil
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import { clamp } from '../utils/Utils.js';

export class Slider extends Interface {
    constructor({
        name,
        min = 0,
        max = 1,
        step = 0.01,
        value = 0,
        callback
    }) {
        super('.slider');

        this.name = name;
        this.min = min;
        this.max = max;
        this.step = step;
        this.precision = this.getPrecision(this.step);
        this.value = value;
        this.callback = callback;

        this.range = this.max - this.min;
        this.value = this.getValue(this.value);
        this.lastValue = this.value;

        this.bounds = null;
        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.lastMouse = new Vector2();
        this.lastOrigin = new Vector2();

        this.init();
        this.setValue(this.value);

        this.addListeners();
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            height: 25,
            cursor: 'w-resize'
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

        this.number = new Interface('.number');
        this.number.css({
            cssFloat: 'right',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 20,
            letterSpacing: 'var(--ui-number-letter-spacing)'
        });
        this.container.add(this.number);

        this.line = new Interface('.line');
        this.line.css({
            clear: 'both',
            height: 1,
            backgroundColor: 'var(--ui-color)',
            transformOrigin: 'left center'
        });
        this.container.add(this.line);
    }

    addListeners() {
        this.container.element.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        this.container.element.removeEventListener('pointerdown', this.onPointerDown);
    }

    getPrecision(value) {
        const string = String(value);
        const delimiter = string.indexOf('.') + 1;

        return !delimiter ? 0 : string.length - delimiter;
    }

    getValue(value) {
        return parseFloat(clamp(value, this.min, this.max).toFixed(this.precision));
    }

    // Event handlers

    onPointerDown = e => {
        if (this.container.element.contains(e.target)) {
            this.bounds = this.element.getBoundingClientRect();
            this.lastMouse.set(e.clientX, e.clientY);
            this.lastOrigin.subVectors(this.lastMouse, this.bounds);
            this.lastValue = this.value;

            this.onPointerMove(e);

            window.addEventListener('pointermove', this.onPointerMove);
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
        this.origin.addVectors(this.lastOrigin, this.delta);

        let value = (this.min + (this.origin.x / this.bounds.width) * this.range) - this.lastValue;
        value = Math.floor(value / this.step);
        this.value = this.getValue(this.lastValue + value * this.step);

        this.update();
    };

    onPointerUp = () => {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    };

    // Public methods

    hasContent() {
        return !!this.group;
    }

    setContent(content) {
        if (!this.group) {
            this.group = new Interface('.group');
            this.group.css({
                position: 'relative'
            });
            this.add(this.group);
        }

        const oldGroup = this.group;

        const newGroup = this.group.clone();
        newGroup.add(content);

        this.replace(oldGroup, newGroup);
        this.group = newGroup;

        oldGroup.destroy();
    }

    toggleContent(show) {
        if (show) {
            this.group.show();
        } else {
            this.group.hide();
        }
    }

    setValue(value, notify = true) {
        this.value = this.getValue(value);

        this.update(notify);
    }

    update(notify = true) {
        const scaleX = (this.value - this.min) / this.range;

        this.line.css({ scaleX });
        this.number.text(this.value);

        if (notify) {
            this.events.emit('update', { path: [], value: this.value, target: this });

            if (this.callback) {
                this.callback(this.value, this);
            }
        }
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
