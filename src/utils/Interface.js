/**
 * @author pschroen / https://ufo.ai/
 */

import { EventEmitter } from './EventEmitter.js';

import { clearTween, tween } from '../tween/Tween.js';

// https://developer.mozilla.org/en-US/docs/Web/CSS/transform
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter
const Transforms = ['x', 'y', 'z', 'skewX', 'skewY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'scale', 'scaleX', 'scaleY', 'scaleZ'];
const Filters = ['blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia'];
const Numeric = ['opacity', 'zIndex', 'fontWeight', 'strokeWidth', 'strokeDashoffset', 'stopOpacity'];
const Lacuna1 = ['opacity', 'brightness', 'contrast', 'saturate', 'scale', 'stopOpacity'];

export class Interface {
    constructor(name, type = 'div', qualifiedName) {
        this.events = new EventEmitter();
        this.children = [];
        this.style = {};
        this.isTransform = false;
        this.isFilter = false;

        if (typeof name === 'object' && name !== null) {
            this.element = name;
        } else if (type !== null) {
            if (type === 'svg') {
                this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName || 'svg');
            } else {
                this.element = document.createElement(type);
            }

            if (typeof name === 'string') {
                if (name.startsWith('.')) {
                    this.element.className = name.slice(1);
                } else {
                    this.element.id = name;
                }
            }
        }
    }

    add(child) {
        if (!this.children) {
            return;
        }

        this.children.push(child);

        child.parent = this;

        if (child.element) {
            this.element.appendChild(child.element);
        } else if (child.nodeName) {
            this.element.appendChild(child);
        }

        return child;
    }

    addBefore(child, object) {
        if (!this.children) {
            return;
        }

        this.children.push(child);

        child.parent = this;

        if (child.element) {
            if (object.element) {
                this.element.insertBefore(child.element, object.element);
            } else if (object.nodeName) {
                this.element.insertBefore(child.element, object);
            }
        } else if (child.nodeName) {
            if (object.element) {
                this.element.insertBefore(child, object.element);
            } else if (object.nodeName) {
                this.element.insertBefore(child, object);
            }
        }

        return child;
    }

    remove(child) {
        if (!this.children) {
            return;
        }

        if (child.element && child.element.parentNode) {
            child.element.parentNode.removeChild(child.element);
        } else if (child.nodeName && child.parentNode) {
            child.parentNode.removeChild(child);
        }

        const index = this.children.indexOf(child);

        if (~index) {
            this.children.splice(index, 1);
        }
    }

    replace(oldChild, newChild) {
        if (!this.children) {
            return;
        }

        const index = this.children.indexOf(oldChild);

        if (~index) {
            this.children[index] = newChild;

            newChild.parent = this;
        }

        if (oldChild.element && oldChild.element.parentNode) {
            if (newChild.element) {
                oldChild.element.parentNode.replaceChild(newChild.element, oldChild.element);
            } else if (newChild.nodeName) {
                oldChild.element.parentNode.replaceChild(newChild, oldChild.element);
            }
        } else if (oldChild.nodeName && oldChild.parentNode) {
            if (newChild.element) {
                oldChild.parentNode.replaceChild(newChild.element, oldChild);
            } else if (newChild.nodeName) {
                oldChild.parentNode.replaceChild(newChild, oldChild);
            }
        }
    }

    clone(deep) {
        if (!this.element) {
            return;
        }

        return new Interface(this.element.cloneNode(deep));
    }

    empty() {
        if (!this.element) {
            return;
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i] && this.children[i].destroy) {
                this.children[i].destroy();
            }
        }

        this.children.length = 0;

        this.element.innerHTML = '';

        return this;
    }

    attr(props) {
        if (!this.element) {
            return;
        }

        for (const key in props) {
            this.element.setAttribute(key, props[key]);
        }

        return this;
    }

    css(props) {
        if (!this.element) {
            return;
        }

        const style = this.style;

        for (const key in props) {
            if (~Transforms.indexOf(key)) {
                style[key] = props[key];
                this.isTransform = true;
                continue;
            }

            if (~Filters.indexOf(key)) {
                style[key] = props[key];
                this.isFilter = true;
                continue;
            }

            if (~Numeric.indexOf(key)) {
                style[key] = props[key];
                this.element.style[key] = props[key];
            } else {
                if (typeof props[key] === 'number') {
                    style[key] = props[key];
                }

                this.element.style[key] = typeof props[key] !== 'string' ? `${props[key]}px` : props[key];
            }
        }

        if (this.isTransform) {
            let transform = '';

            if (style.x !== undefined || style.y !== undefined || style.z !== undefined) {
                const x = style.x !== undefined ? style.x : 0;
                const y = style.y !== undefined ? style.y : 0;
                const z = style.z !== undefined ? style.z : 0;

                transform += `translate3d(${x}px, ${y}px, ${z}px)`;
            }

            if (style.skewX !== undefined) {
                transform += `skewX(${style.skewX}deg)`;
            }

            if (style.skewY !== undefined) {
                transform += `skewY(${style.skewY}deg)`;
            }

            if (style.rotation !== undefined) {
                transform += `rotate(${style.rotation}deg)`;
            }

            if (style.rotationX !== undefined) {
                transform += `rotateX(${style.rotationX}deg)`;
            }

            if (style.rotationY !== undefined) {
                transform += `rotateY(${style.rotationY}deg)`;
            }

            if (style.rotationZ !== undefined) {
                transform += `rotateZ(${style.rotationZ}deg)`;
            }

            if (style.scale !== undefined) {
                transform += `scale(${style.scale})`;
            }

            if (style.scaleX !== undefined) {
                transform += `scaleX(${style.scaleX})`;
            }

            if (style.scaleY !== undefined) {
                transform += `scaleY(${style.scaleY})`;
            }

            if (style.scaleZ !== undefined) {
                transform += `scaleZ(${style.scaleZ})`;
            }

            this.element.style.transform = transform;
        }

        if (this.isFilter) {
            let filter = '';

            if (style.blur !== undefined) {
                filter += `blur(${style.blur}px)`;
            }

            if (style.brightness !== undefined) {
                filter += `brightness(${style.brightness})`;
            }

            if (style.contrast !== undefined) {
                filter += `contrast(${style.contrast})`;
            }

            if (style.grayscale !== undefined) {
                filter += `grayscale(${style.grayscale})`;
            }

            if (style.hue !== undefined) {
                filter += `hue-rotate(${style.hue}deg)`;
            }

            if (style.invert !== undefined) {
                filter += `invert(${style.invert})`;
            }

            if (style.saturate !== undefined) {
                filter += `saturate(${style.saturate})`;
            }

            if (style.sepia !== undefined) {
                filter += `sepia(${style.sepia})`;
            }

            this.element.style.filter = filter;
        }

        return this;
    }

    text(string) {
        if (!this.element) {
            return;
        }

        if (string === undefined) {
            return this.element.textContent;
        } else {
            this.element.textContent = string;
        }

        return this;
    }

    html(string) {
        if (!this.element) {
            return;
        }

        if (string === undefined) {
            return this.element.innerHTML;
        } else {
            this.element.innerHTML = string;
        }

        return this;
    }

    hide() {
        return this.css({ display: 'none' });
    }

    show() {
        return this.css({ display: '' });
    }

    invisible() {
        return this.css({ visibility: 'hidden' });
    }

    visible() {
        return this.css({ visibility: '' });
    }

    intersects(object) {
        if (!this.element) {
            return;
        }

        const a = this.element.getBoundingClientRect();
        let b;

        if (object.element) {
            b = object.element.getBoundingClientRect();
        } else if (object.nodeName) {
            b = object.getBoundingClientRect();
        }

        return a.bottom > b.top && a.right > b.left && a.top < b.bottom && a.left < b.right;
    }

    drawLine(progress = this.progress || 0) {
        if (!this.element) {
            return;
        }

        const start = this.start || 0;
        const offset = this.offset || 0;

        const length = this.element.getTotalLength();
        const dash = length * progress;
        const gap = length - dash;

        const style = {
            strokeDasharray: `${dash},${gap}`,
            strokeDashoffset: -length * (start + offset)
        };

        return this.css(style);
    }

    tween(props, duration, ease, delay = 0, complete, update) {
        if (!this.element) {
            return;
        }

        if (typeof delay !== 'number') {
            update = complete;
            complete = delay;
            delay = 0;
        }

        const style = getComputedStyle(this.element);

        for (const key in props) {
            if (this.style[key] === undefined) {
                if (~Transforms.indexOf(key) || ~Filters.indexOf(key) || ~Numeric.indexOf(key)) {
                    this.style[key] = ~Lacuna1.indexOf(key) ? 1 : 0;
                } else if (typeof style[key] === 'string') {
                    this.style[key] = parseFloat(style[key]);
                }
            }

            if (isNaN(this.style[key])) {
                delete this.style[key];
            }
        }

        for (const key in this.style) {
            if (props[key] === undefined) {
                delete this.style[key];
            }
        }

        const promise = tween(this.style, props, duration, ease, delay, complete, () => {
            this.css(this.style);

            if (update) {
                update();
            }
        });

        return promise;
    }

    clearTween() {
        clearTween(this.style);

        return this;
    }

    destroy() {
        if (!this.children) {
            return;
        }

        if (this.parent && this.parent.remove) {
            this.parent.remove(this);
        }

        this.clearTween();

        this.events.destroy();

        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i] && this.children[i].destroy) {
                this.children[i].destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
