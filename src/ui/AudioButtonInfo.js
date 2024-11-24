/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

export class AudioButtonInfo extends Interface {
    constructor() {
        super('.info');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0
        });
    }

    // Event handlers

    onClick = () => {
        open(this.link);
    };

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        if (!this.wrapper) {
            this.wrapper = new Interface('.wrapper');
            this.wrapper.css({
                position: 'relative',
                webkitUserSelect: 'none',
                userSelect: 'none'
            });
            this.add(this.wrapper);
        }

        const oldWrapper = this.wrapper;
        oldWrapper.element.removeEventListener('click', this.onClick);

        const newWrapper = this.wrapper.clone();

        const name = new Interface('.name');
        name.css({
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 'var(--ui-title-line-height)',
            letterSpacing: 'var(--ui-number-letter-spacing)',
            whiteSpace: 'nowrap'
        });

        if (data.name) {
            name.html(data.name);
        }

        const title = new Interface('.title');
        title.css({
            fontSize: 'var(--ui-secondary-font-size)',
            letterSpacing: 'var(--ui-secondary-letter-spacing)',
            color: 'var(--ui-secondary-color)'
        });

        if (data.title) {
            title.html(data.title);
        }

        newWrapper.add(name);
        newWrapper.add(title);

        if (data.image) {
            const thumbnail = new Interface();
            thumbnail.css({
                position: 'absolute',
                left: -40,
                top: 3,
                boxSizing: 'border-box',
                width: 30,
                height: 30,
                border: '1px solid var(--ui-color-divider-line)',
                cursor: 'pointer'
            });
            newWrapper.add(thumbnail);

            const image = new Interface(data.image.cloneNode());
            image.css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            });
            thumbnail.add(image);
        }

        if (data.link) {
            newWrapper.css({
                cursor: 'pointer',
                pointerEvents: 'auto'
            });
            newWrapper.element.addEventListener('click', this.onClick);

            this.link = data.link;
        }

        this.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
            this.replace(oldWrapper, newWrapper);
            this.wrapper = newWrapper;

            oldWrapper.destroy();

            this.css({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    }
}
