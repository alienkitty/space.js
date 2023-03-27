/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Link } from './Link.js';
import { List } from './List.js';
import { Slider } from './Slider.js';
import { ColorPicker } from './ColorPicker.js';

export class PanelItem extends Interface {
    constructor(data) {
        super('.panel-item');

        this.data = data;

        this.width = 128;

        this.initHTML();
    }

    initHTML() {
        const width = this.width;

        if (!this.data.type) {
            this.css({
                boxSizing: 'border-box',
                width,
                padding: '10px 10px 0',
                marginBottom: 10
            });

            this.text = new Interface('.text');
            this.text.css({
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            this.text.text(this.data.label);
            this.add(this.text);
        } else if (this.data.type === 'spacer') {
            this.css({
                boxSizing: 'border-box',
                width,
                height: 7
            });
        } else if (this.data.type === 'divider') {
            this.css({
                boxSizing: 'border-box',
                width,
                padding: '0 10px',
                margin: '7px 0'
            });

            this.line = new Interface('.line');
            this.line.css({
                width: '100%',
                height: 1,
                backgroundColor: 'rgba(var(--ui-color-triplet), 0.25)',
                transformOrigin: 'left center'
            });
            this.add(this.line);
        } else if (this.data.type === 'link') {
            this.css({
                boxSizing: 'border-box',
                width,
                padding: '2px 10px 0'
            });

            this.link = new Link(this.data);
            this.add(this.link);
        } else if (this.data.type === 'list') {
            this.css({
                boxSizing: 'border-box',
                width,
                padding: '2px 10px 0'
            });

            const list = Object.keys(this.data.list);
            const index = list.indexOf(this.data.value);
            const callback = this.data.callback;

            this.list = new List({ list, index, callback });
            this.add(this.list);
        } else if (this.data.type === 'slider') {
            this.css({
                boxSizing: 'border-box',
                width,
                padding: '0 10px'
            });

            this.slider = new Slider(this.data);
            this.add(this.slider);
        } else if (this.data.type === 'color') {
            this.css({
                boxSizing: 'border-box',
                width,
                height: 19,
                padding: '0 10px',
                marginBottom: 7
            });

            this.color = new ColorPicker(this.data);
            this.add(this.color);
        }
    }

    /**
     * Public methods
     */

    animateIn = (delay, fast) => {
        if (this.data && this.data.type === 'divider') {
            this.line.clearTween().css({ scaleX: 0, opacity: 1 }).tween({ scaleX: 1 }, 400, 'easeInOutCubic', delay);
        }

        this.clearTween().css({ y: fast ? 0 : -10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 400, 'easeOutCubic', delay);
    };

    animateOut = (index, total, delay, callback) => {
        if (this.data && this.data.type === 'divider') {
            this.line.clearTween().tween({ scaleX: 0, opacity: 0 }, 500, 'easeInCubic', delay);
        }

        this.clearTween().tween({ y: -10, opacity: 0 }, 500, 'easeInCubic', delay, () => {
            if (index === 0 && callback) {
                callback();
            }
        });
    };
}
