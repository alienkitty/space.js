/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://acko.net/blog/farbtastic-jquery-color-picker-plug-in/
 * Based on https://github.com/mattfarina/farbtastic
 * Based on https://github.com/timjb/colortriangle
 * Based on https://github.com/lo-th/uil
 */

import { Color } from '../math/Color.js';
import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { PI, PI60, PI90, Third, TwoPI, brightness, clamp, radToDeg } from '../utils/Utils.js';

var id = 0;

export class ColorPicker extends Interface {
    constructor({
        name,
        value,
        noSwatch = false,
        noText = false,
        callback
    }) {
        super('.color-picker');

        this.name = name;
        this.value = new Color(value);
        this.noSwatch = noSwatch;
        this.noText = noText;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.height = 20;
        this.middle = this.width / 2;
        this.top = this.height + 9;
        this.distance = 256;
        this.ratio = 256 / this.width;
        this.triangleRadius = 98;
        this.triangleSideLength = Math.sqrt(3) * this.triangleRadius;

        this.bounds = null;
        this.offset = new Vector2();
        this.marker = new Vector2();
        this.isOpen = false;
        this.isDown = false;
        this.firstDown = false;
        this.lastCursor = '';
        this.fastClose = true;

        this.h = 0;
        this.s = 0;
        this.l = 0;

        this.color = new Color();

        this.init();
        this.initColorRing();
        this.setValue(this.value, false);

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            height: this.height
        });

        if (!this.noSwatch || !this.noText) {
            this.container = new Interface('.container');
            this.container.css({
                height: this.height,
                lineHeight: this.height,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
            });
            this.add(this.container);

            if (!this.noSwatch) {
                this.swatch = new Interface('.swatch');
                this.swatch.css({
                    cssFloat: 'left',
                    boxSizing: 'border-box',
                    width: this.height,
                    height: this.height,
                    backgroundColor: 'var(--ui-bg-color)',
                    border: '1px solid var(--ui-color-divider-line)',
                    cursor: 'pointer'
                });
                this.container.add(this.swatch);
            }

            if (!this.noText) {
                this.content = new Interface('.content');
                this.content.css({
                    cssFloat: 'right'
                });
                this.container.add(this.content);
            }
        }
    }

    initColorRing() {
        id++;

        const size = 256;

        this.colorRing = new Interface(null, 'svg');
        this.colorRing.hide();
        this.colorRing.attr({
            viewBox: `0 0 ${size} ${size}`,
            width: size,
            height: size
        });
        this.colorRing.css({
            position: 'absolute',
            left: 0,
            top: this.top,
            width: this.width,
            height: this.width
        });

        this.colorRing.defs = new Interface(null, 'svg', 'defs');
        this.colorRing.add(this.colorRing.defs);

        this.colorRing.ring = new Interface(null, 'svg', 'g');
        this.colorRing.add(this.colorRing.ring);

        const strokeWidth = 30;
        const radius = (size - strokeWidth) / 2;
        const middle = size / 2;
        const segments = 24;
        const nudge = 8 / radius / segments * Math.PI;

        let colors, gradient;

        let a1 = 0;
        let lastColor;

        // Hue
        for (let i = 0; i <= segments; i++) {
            const hue = i / segments;
            const a2 = hue * TwoPI;
            const am = (a1 + a2) / 2;
            const tan = 1 / Math.cos((a2 - a1) / 2);

            const array = [
                Math.sin(a1), -Math.cos(a1),
                Math.sin(am) * tan, -Math.cos(am) * tan,
                Math.sin(a2), -Math.cos(a2)
            ];

            const color = `#${this.color.setHSL(hue, 1, 0.5).getHexString()}`;

            if (i > 0) {
                let j = 6;

                while (j--) {
                    array[j] = ((array[j] * radius) + middle).toFixed(2);
                }

                colors = [
                    { offset: '0%', stopColor: lastColor, stopOpacity: 1 },
                    { offset: '100%', stopColor: color, stopOpacity: 1 }
                ];

                gradient = this.createGradient('linearGradient', { id: `gradient${i}_${id}`, x1: array[0], y1: array[1], x2: array[4], y2: array[5] }, colors);
                this.colorRing.defs.add(gradient);

                const path = new Interface(null, 'svg', 'path');
                path.attr({
                    d: `M ${array[0]} ${array[1]} Q ${array[2]} ${array[3]} ${array[4]} ${array[5]}`
                });
                path.css({
                    stroke: `url(#gradient${i}_${id})`,
                    strokeWidth,
                    strokeLinecap: 'butt'
                });
                this.colorRing.ring.add(path);
            }

            a1 = a2 - nudge;
            lastColor = color;
        }

        // Saturation
        colors = [
            { offset: '0%', stopColor: '#7f7f7f', stopOpacity: 1 },
            { offset: '50%', stopColor: '#7f7f7f', stopOpacity: 0.5 },
            { offset: '100%', stopColor: '#7f7f7f', stopOpacity: 0 }
        ];

        gradient = this.createGradient('linearGradient', { id: `saturation_${id}`, x1: middle - 49.05, y1: 0, x2: middle + 98, y2: 0 }, colors);
        this.colorRing.defs.add(gradient);

        // Lightness
        colors = [
            { offset: '0%', stopColor: '#fff', stopOpacity: 1 },
            { offset: '50%', stopColor: '#fff', stopOpacity: 0 },
            { offset: '50%', stopColor: '#000', stopOpacity: 0 },
            { offset: '100%', stopColor: '#000', stopOpacity: 1 }
        ];

        gradient = this.createGradient('linearGradient', { id: `lightness_${id}`, x1: 0, y1: middle - 84.90, x2: 0, y2: middle + 84.90 }, colors);
        this.colorRing.defs.add(gradient);

        this.colorRing.sl = new Interface(null, 'svg', 'g');
        this.colorRing.sl.css({
            transformOrigin: '128px 128px',
            rotation: 0
        });
        this.colorRing.add(this.colorRing.sl);

        this.colorRing.hue = new Interface(null, 'svg', 'polygon');
        this.colorRing.hue.attr({
            points: '78.95 43.1 78.95 212.85 226 128'
        });
        this.colorRing.hue.css({
            fill: 'red'
        });
        this.colorRing.sl.add(this.colorRing.hue);

        this.colorRing.saturation = new Interface(null, 'svg', 'polygon');
        this.colorRing.saturation.attr({
            points: '78.95 43.1 78.95 212.85 226 128'
        });
        this.colorRing.saturation.css({
            fill: `url(#saturation_${id})`
        });
        this.colorRing.sl.add(this.colorRing.saturation);

        this.colorRing.lightness = new Interface(null, 'svg', 'polygon');
        this.colorRing.lightness.attr({
            points: '78.95 43.1 78.95 212.85 226 128'
        });
        this.colorRing.lightness.css({
            fill: `url(#lightness_${id})`
        });
        this.colorRing.sl.add(this.colorRing.lightness);

        this.colorRing.hueMarker = new Interface(null, 'svg', 'path');
        this.colorRing.hueMarker.attr({
            d: 'M 255.75 136.5 Q 256 132.3 256 128 256 123.7 255.75 119.5 L 241 128 255.75 136.5 Z'
        });
        this.colorRing.hueMarker.css({
            fill: 'none',
            stroke: '#fff',
            strokeWidth: 2
        });
        this.colorRing.sl.add(this.colorRing.hueMarker);

        this.colorRing.slMarker = new Interface(null, 'svg', 'circle');
        this.colorRing.slMarker.attr({
            cx: 128,
            cy: 128,
            r: 6
        });
        this.colorRing.slMarker.css({
            fill: 'none',
            stroke: '#fff',
            strokeWidth: 2
        });
        this.colorRing.add(this.colorRing.slMarker);

        this.add(this.colorRing);
    }

    createGradient(type, props, colors) {
        const gradient = new Interface(null, 'svg', type);
        gradient.attr({
            ...props,
            gradientUnits: 'userSpaceOnUse'
        });

        colors.forEach(({ offset, stopColor, stopOpacity }) => {
            const stop = new Interface(null, 'svg', 'stop');
            stop.attr({
                offset
            });
            stop.css({
                stopColor,
                stopOpacity
            });
            gradient.add(stop);
        });

        return gradient;
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);

        if (!this.noSwatch || !this.noText) {
            this.container.element.addEventListener('click', this.onClick);
        }

        this.element.addEventListener('pointerdown', this.onPointerDown);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);

        if (!this.noSwatch || !this.noText) {
            this.container.element.removeEventListener('click', this.onClick);
        }

        this.element.removeEventListener('pointerdown', this.onPointerDown);
    }

    // Event handlers

    onColorPicker = ({ open }) => {
        if (this.isOpen && !open) {
            this.close();
        }
    };

    onClick = () => {
        if (!this.isOpen) {
            Stage.events.emit('color_picker', { open: false, target: this });

            this.open();

            Stage.events.emit('color_picker', { open: true, target: this });
        } else {
            this.close();

            Stage.events.emit('color_picker', { open: false, target: this });
        }
    };

    onPointerDown = e => {
        if (!this.isOpen) {
            return;
        }

        this.isDown = true;
        this.firstDown = true;

        this.onPointerMove(e);

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    };

    onPointerMove = ({ clientX, clientY }) => {
        if (!this.isOpen) {
            return;
        }

        this.bounds = this.element.getBoundingClientRect();
        this.offset.x = clientX - (this.bounds.left + this.middle);
        this.offset.y = clientY - (this.bounds.top + this.top + this.middle);

        const distance = this.offset.length() * this.ratio;

        if (distance < 128) {
            this.setCursor('crosshair');
        } else if (!this.isDown) {
            this.setCursor();
        }

        if (this.firstDown) {
            this.firstDown = false;
            this.distance = distance;
        }

        if (this.isDown) {
            if (this.distance < 128) {
                if (this.distance > this.triangleRadius) {
                    // Ring
                    const angle = this.offset.angle();

                    this.h = (angle + PI90) / TwoPI;
                } else {
                    // Triangle
                    const x = this.offset.x * this.ratio;
                    const y = this.offset.y * this.ratio;

                    let angle = this.h * TwoPI + PI;

                    if (angle < 0) {
                        angle += TwoPI;
                    }

                    let rad = Math.atan2(-y, x);

                    if (rad < 0) {
                        rad += TwoPI;
                    }

                    const a = this.triangleRadius / 2;
                    let rad0 = (rad + PI90 + TwoPI + angle) % TwoPI;
                    let rad1 = rad0 % Third - PI60;
                    let b = Math.tan(rad1) * a;
                    let r = Math.sqrt(x * x + y * y);
                    const maxR = Math.sqrt(a * a + b * b);

                    if (r > maxR) {
                        const dx = Math.tan(rad1) * r;
                        let rad2 = Math.atan(dx / maxR);

                        if (rad2 > PI60) {
                            rad2 = PI60;
                        } else if (rad2 < -PI60) {
                            rad2 = -PI60;
                        }

                        rad += rad2 - rad1;

                        rad0 = (rad + PI90 + TwoPI + angle) % TwoPI;
                        rad1 = rad0 % Third - PI60;
                        b = Math.tan(rad1) * a;
                        r = Math.sqrt(a * a + b * b);
                    }

                    const lightness = (Math.sin(rad0) * r) / this.triangleSideLength + 0.5;

                    const w = 1 - Math.abs(lightness - 0.5) * 2;
                    let saturation = ((Math.cos(rad0) * r + a) / (1.5 * this.triangleRadius)) / w;
                    saturation = clamp(saturation, 0, 1);

                    this.s = saturation;
                    this.l = lightness;
                }

                this.value.setHSL(this.h, this.s, this.l);

                this.update();
            }
        }
    };

    onPointerUp = () => {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);

        if (!this.isOpen) {
            return;
        }

        this.isDown = false;
        this.distance = 256;
    };

    // Public methods

    setCursor(cursor = '') {
        if (cursor !== this.lastCursor) {
            this.lastCursor = cursor;

            this.css({ cursor });
        }
    }

    setHeight() {
        const height = this.isOpen ? this.width + this.height + 10 : this.height;

        this.parent.css({ height });
    }

    setValue(value, notify = true) {
        if (value && value.isColor) {
            this.value.copy(value);
        } else {
            this.value.set(value);
        }

        this.value.getHSL(this);

        this.update(notify);
    }

    setHSL(h, s, l, notify = true) {
        this.value.setHSL(h, s, l);

        this.h = h;
        this.s = s;
        this.l = l;

        this.update(notify);
    }

    update(notify = true) {
        this.moveMarkers();

        if (this.swatch) {
            this.swatch.css({ backgroundColor: `#${this.value.getHexString()}` });
        }

        if (this.content) {
            this.content.text(`0x${this.value.getHexString().toUpperCase()}`);
        }

        if (notify) {
            this.events.emit('update', { path: [], value: this.value, target: this });

            if (this.callback) {
                this.callback(this.value, this);
            }
        }
    }

    moveMarkers() {
        const marker = this.marker;

        const radius = this.triangleRadius;
        const angle = this.h * TwoPI;
        const hue = -angle + PI90;
        const saturation = this.s;
        const lightness = this.l;

        const hx = Math.cos(hue) * radius;
        const hy = -Math.sin(hue) * radius;
        const sx = Math.cos(hue - Third) * radius;
        const sy = -Math.sin(hue - Third) * radius;
        const vx = Math.cos(hue + Third) * radius;
        const vy = -Math.sin(hue + Third) * radius;
        const mx = (sx + vx) / 2;
        const my = (sy + vy) / 2;
        const a = (1 - Math.abs(lightness - 0.5) * 2) * saturation;
        const x = sx + (vx - sx) * lightness + (hx - mx) * a;
        const y = sy + (vy - sy) * lightness + (hy - my) * a;

        marker.set(x, y).addScalar(128);

        // Light colour is inverted
        const invert = brightness(this.value) > 0.6;

        this.colorRing.sl.css({
            rotation: radToDeg(angle - PI90)
        });

        this.colorRing.hue.css({
            fill: `#${this.color.setHSL(this.h, 1, 0.5).getHexString()}`
        });

        this.colorRing.hueMarker.css({
            stroke: invert ? '#000' : '#fff'
        });

        this.colorRing.slMarker.attr({
            cx: marker.x,
            cy: marker.y
        });
        this.colorRing.slMarker.css({
            fill: `#${this.value.getHexString()}`,
            stroke: invert ? '#000' : '#fff'
        });
    }

    open() {
        this.isOpen = true;

        this.setHeight();

        this.colorRing.show();
        this.colorRing.css({ y: -10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 175, 'easeOutCubic');
    }

    close() {
        this.isOpen = false;

        this.setHeight();

        if (this.fastClose) {
            this.colorRing.hide();
        } else {
            this.colorRing.tween({ y: -10, opacity: 0 }, 300, 'easeInCubic', () => {
                this.colorRing.hide();
            });
        }

        this.setCursor();
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
