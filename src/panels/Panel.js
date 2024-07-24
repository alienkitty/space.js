/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

import { ticker } from '../tween/Ticker.js';

export class Panel extends Interface {
    constructor() {
        super('.panel');

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.invertColors = {
            light: Stage.rootStyle.getPropertyValue('--ui-invert-light-color').trim(),
            lightTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-triplet').trim(),
            lightLine: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-line').trim(),
            dark: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color').trim(),
            darkTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-triplet').trim(),
            darkLine: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-line').trim()
        };

        this.startTime = performance.now();
        this.items = [];
        this.animatedIn = false;
        this.openColor = null;

        this.init();

        this.addListeners();
    }

    init() {
        this.hide();
        this.css({
            width: 'var(--ui-panel-width)',
            pointerEvents: 'auto',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
    }

    removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);

        this.items.forEach(item => {
            item.events.off('update', this.onUpdate);
        });
    }

    // Event handlers

    onColorPicker = ({ open, target }) => {
        if (!this.openColor && !this.element.contains(target.element)) {
            return;
        }

        if (open) {
            this.disable(target);

            this.openColor = target;
        } else {
            this.enable();

            this.openColor = null;
        }
    };

    onUpdate = e => {
        this.events.emit('update', e);
    };

    // Public methods

    add(item) {
        item.events.on('update', this.onUpdate);

        super.add(item);

        this.items.push(item);
    }

    setPanelIndex(name, index, path = []) {
        this.items.forEach(({ view }) => {
            if (!view) {
                return;
            }

            if (view.name === name && view.setIndex) {
                view.setIndex(index);
                return;
            }

            if (path.length) {
                const [pathName, pathIndex] = path[0];

                if (view.name === pathName) {
                    if (view.index !== pathIndex) {
                        view.setIndex(pathIndex);
                    }

                    path.shift();
                }
            }

            if (view.group && view.group.children[0] && view.group.children[0].setPanelIndex) {
                view.group.children[0].setPanelIndex(name, index, path);
            }
        });
    }

    setPanelValue(name, value, path = []) {
        this.items.forEach(({ view }) => {
            if (!view) {
                return;
            }

            if (view.name === name && view.setValue) {
                view.setValue(value);
                return;
            }

            if (path.length) {
                const [pathName, pathIndex] = path[0];

                if (view.name === pathName) {
                    if (view.index !== pathIndex) {
                        view.setIndex(pathIndex);
                    }

                    path.shift();
                }
            }

            if (view.group && view.group.children[0] && view.group.children[0].setPanelValue) {
                view.group.children[0].setPanelValue(name, value, path);
            }
        });
    }

    invert(isInverted) {
        Stage.root.style.setProperty('--ui-color', isInverted ? this.invertColors.light : this.invertColors.dark);
        Stage.root.style.setProperty('--ui-color-triplet', isInverted ? this.invertColors.lightTriplet : this.invertColors.darkTriplet);
        Stage.root.style.setProperty('--ui-color-line', isInverted ? this.invertColors.lightLine : this.invertColors.darkLine);

        Stage.events.emit('invert', { invert: isInverted });
    }

    update() {
        if (!ticker.isAnimating) {
            ticker.onTick(performance.now() - this.startTime);
        }
    }

    animateIn(fast) {
        this.show();

        this.items.forEach((item, i) => item.animateIn(i * 15, fast));

        this.animatedIn = true;
    }

    animateOut(callback) {
        if (!this.animatedIn) {
            return;
        }

        this.animatedIn = false;

        this.items.forEach((item, i) => {
            item.animateOut(i, this.items.length - 1, (this.items.length - 1 - i) * 15, () => {
                this.hide();

                if (callback) {
                    callback();
                }
            });
        });
    }

    enable() {
        this.items.forEach(item => {
            if (item.view && item.view.group && item.view.container) {
                item.enable(item.view.container);
            }

            item.enable();
        });
    }

    disable(target) {
        this.items.forEach(item => {
            if (item.view && item.view.group && item.view.container) {
                item.disable(item.view.container);
            }

            if (target && item.element.contains(target.element)) {
                return;
            }

            item.disable();
        });
    }

    activate() {
        this.clearTween().tween({ opacity: 1 }, 300, 'easeOutSine');
    }

    deactivate() {
        this.clearTween().tween({ opacity: 0 }, 300, 'easeOutSine');
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
