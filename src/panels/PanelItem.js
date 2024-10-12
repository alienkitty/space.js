/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { PanelLink } from './PanelLink.js';
import { PanelThumbnail } from './PanelThumbnail.js';
import { PanelGraph } from './PanelGraph.js';
import { List } from './List.js';
import { Slider } from './Slider.js';
import { Content } from './Content.js';
import { ColorPicker } from './ColorPicker.js';

/**
 * A panel item for various components.
 * @example
 * // ...
 * const item = new PanelItem({
 *     name: 'FPS'
 *     // type: 'spacer'
 *     // type: 'divider'
 *     // type: 'link'
 *     // type: 'thumbnail'
 *     // type: 'graph'
 *     // type: 'list'
 *     // type: 'slider'
 *     // type: 'content'
 *     // type: 'color'
 * });
 * ui.addPanel(item);
 */
export class PanelItem extends Interface {
    constructor(data) {
        super('.panel-item');

        this.data = data;

        this.init();
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            boxSizing: 'border-box'
        });
        this.add(this.container);

        if (!this.data.type) {
            this.content = new Interface('.content');
            this.content.css({
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            this.content.text(this.data.name);
            this.container.add(this.content);
        } else if (this.data.type === 'spacer') {
            this.container.css({
                height: 7
            });
        } else if (this.data.type === 'divider') {
            this.container.css({
                margin: '6px 0'
            });

            this.line = new Interface('.line');
            this.line.css({
                height: 1,
                backgroundColor: 'var(--ui-color-divider-line)'
            });
            this.container.add(this.line);
        } else if (this.data.type === 'link') {
            this.container.css({
                margin: '2px 0 0'
            });

            this.view = new PanelLink(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        } else if (this.data.type === 'thumbnail') {
            this.view = new PanelThumbnail(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        } else if (this.data.type === 'graph') {
            this.container.css({
                margin: '0 0 6px'
            });

            this.graph = new PanelGraph(this.data);
            this.container.add(this.graph);
        } else if (this.data.type === 'list') {
            this.container.css({
                margin: '2px 0 0'
            });

            this.view = new List(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        } else if (this.data.type === 'slider') {
            this.view = new Slider(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        } else if (this.data.type === 'content') {
            this.view = new Content(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        } else if (this.data.type === 'color') {
            this.container.css({
                margin: '0 0 7px'
            });

            this.view = new ColorPicker(this.data);
            this.view.events.on('update', this.onUpdate);
            this.container.add(this.view);
        }
    }

    removeListeners() {
        if (this.view) {
            this.view.events.off('update', this.onUpdate);
        }
    }

    // Event handlers

    onUpdate = e => {
        this.events.emit('update', e);
    };

    // Public methods

    animateIn(delay, fast) {
        this.clearTween();

        if (this.graph) {
            this.graph.enable();
        }

        if (fast) {
            this.css({ y: 0, opacity: 1 });
        } else {
            this.css({ y: -10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 400, 'easeOutCubic', delay);
        }
    }

    animateOut(index, total, delay, callback) {
        this.clearTween().tween({ y: -10, opacity: 0 }, 500, 'easeInCubic', delay, () => {
            if (index === 0 && callback) {
                if (this.graph) {
                    this.graph.disable();
                }

                callback();
            }
        });
    }

    enable(target = this.container) {
        target.clearTween();
        target.tween({ opacity: 1 }, 500, 'easeInOutSine', () => {
            target.css({ pointerEvents: 'auto' });
        });
    }

    disable(target = this.container) {
        target.clearTween();
        target.css({ pointerEvents: 'none' });
        target.tween({ opacity: 0.35 }, 500, 'easeInOutSine');
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
