/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { MenuItem } from './MenuItem.js';

export class Menu extends Interface {
    constructor({
        items,
        active,
        callback
    }) {
        super('.menu');

        this.names = items;
        this.index = this.names.indexOf(active);
        this.callback = callback;

        this.active = -1;
        this.items = [];

        this.init();
        this.initViews();

        this.update();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 20,
            top: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
    }

    initViews() {
        this.names.forEach((name, index) => {
            const item = new MenuItem({ name, index });
            item.events.on('click', this.onClick);
            this.add(item);
            this.items.push(item);
        });
    }

    removeListeners() {
        this.items.forEach(item => {
            item.events.off('click', this.onClick);
        });
    }

    // Event handlers

    onClick = ({ target }) => {
        this.index = target.index;

        this.update();
    };

    // Public methods

    resize(width, height, dpr, breakpoint) {
        if (width < breakpoint) {
            this.css({
                left: 10,
                top: 10,
                right: 10
            });
        } else {
            this.css({
                left: 20,
                top: 20,
                right: 20
            });
        }
    }

    update() {
        const active = this.names[this.index];

        this.events.emit('update', { active, index: this.index, target: this });

        if (this.callback) {
            this.callback(active, this);
        }

        const target = this.items[this.index];
        const direction = this.active > this.index ? 1 : -1;

        this.active = this.index;

        if (target && !target.active) {
            target.activate(direction);
        }

        this.items.forEach(item => {
            if (item !== target && item.active) {
                item.deactivate(direction);
            }
        });
    }

    animateIn() {
        this.items.forEach((item, i) => item.animateIn(i * 200));
    }

    animateOut() {
        this.items.forEach(item => item.animateOut());
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
