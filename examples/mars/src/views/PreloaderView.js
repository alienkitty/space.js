import { Interface, clearTween, tween } from '@alienkitty/space.js/three';

import { store } from '../config/Config.js';

export class PreloaderView extends Interface {
    constructor() {
        super('.preloader');

        this.progress = 0;

        this.init();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.bg = new Interface('.bg');
        this.bg.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--bg-color)'
        });
        this.add(this.bg);

        this.container = new Interface('.container');
        this.container.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 300,
            height: 32,
            marginLeft: -300 / 2,
            marginTop: -32 / 2
        });
        this.add(this.container);

        this.number = new Interface('.number');
        this.number.css({
            position: 'absolute',
            left: '50%',
            width: 110,
            marginLeft: -110 / 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        this.container.add(this.number);

        this.number.info = new Interface('.info', 'h2');
        this.number.info.css({
            textAlign: 'left',
            textTransform: 'uppercase',
            color: 'var(--ui-info-color)',
            whiteSpace: 'nowrap'
        });
        this.number.info.text(store.loading);
        this.number.add(this.number.info);

        this.number.percent = new Interface('.percent', 'h2');
        this.number.percent.css({
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
            textTransform: 'uppercase',
            color: 'var(--ui-info-color)',
            whiteSpace: 'nowrap'
        });
        this.number.percent.text(`${0}%`);
        this.number.add(this.number.percent);

        this.title = new Interface('.title', 'h2');
        this.title.css({
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: 'var(--ui-info-color)',
            whiteSpace: 'nowrap',
            opacity: 0
        });
        this.title.text(`${navigator.maxTouchPoints ? 'Tap' : 'Click'} to visit target`);
        this.container.add(this.title);
    }

    addStartButton() {
        this.number.tween({ opacity: 0 }, 200, 'easeOutSine', () => {
            this.number.hide();
            this.title.css({ y: 10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutQuart', 100);
        });
    }

    swapTitle(text) {
        this.title.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
            if (!this.title) {
                return;
            }

            this.title.text(text);
            this.title.css({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    }

    addListeners() {
        this.bg.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.bg.element.removeEventListener('click', this.onClick);
    }

    // Event handlers

    onProgress = ({ progress }) => {
        clearTween(this);

        tween(this, { progress }, 500, 'linear', null, () => {
            this.number.info.text(store.loading);
            this.number.percent.text(`${Math.round(100 * this.progress)}%`);

            if (this.progress === 1) {
                this.events.emit('complete');

                this.bg.css({ pointerEvents: 'auto' });

                this.addStartButton();
            }
        });
    };

    onClick = () => {
        this.events.emit('start');
    };

    // Public methods

    animateIn = async () => {
    };

    animateOut = () => {
        this.number.clearTween().tween({ opacity: 0 }, 200, 'easeOutSine');
        this.title.clearTween().tween({ opacity: 0 }, 200, 'easeOutSine');
        return this.tween({ opacity: 0 }, 600, 'easeInOutSine');
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
