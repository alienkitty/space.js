/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { TargetNumber } from './TargetNumber.js';
import { Panel } from '../panels/Panel.js';

export class PointInfo extends Interface {
    constructor() {
        super('.info');

        this.numbers = [];
        this.locked = false;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 10,
            top: -15
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            cursor: 'move'
        });
        this.add(this.container);

        this.name = new Interface('.name');
        this.name.css({
            lineHeight: 'var(--ui-title-line-height)',
            whiteSpace: 'nowrap'
        });
        this.container.add(this.name);

        this.type = new Interface('.type');
        this.type.css({
            fontSize: 'var(--ui-secondary-font-size)',
            letterSpacing: 'var(--ui-secondary-letter-spacing)',
            color: 'var(--ui-secondary-color)',
            paddingBottom: 3
        });
        this.container.add(this.type);
    }

    // Public methods

    setData(data) {
        if (!data) {
            return;
        }

        if (data.name) {
            this.name.html(data.name);
        }

        if (data.type) {
            this.type.html(data.type);
        }
    }

    setTargetNumbers(targetNumbers) {
        if (!this.targetNumbers) {
            this.targetNumbers = new Interface('.numbers');
            this.targetNumbers.css({
                position: 'absolute',
                left: -28,
                top: 0,
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 4,
                paddingTop: 3
            });
            this.container.add(this.targetNumbers);
        }

        this.targetNumbers.empty();
        this.numbers.length = 0;

        targetNumbers.forEach(targetNumber => {
            const number = new TargetNumber();
            number.setData({ targetNumber });
            this.targetNumbers.add(number);
            this.numbers.push(number);
        });

        if (this.locked && this.isOpen) {
            this.numbers.forEach(number => number.visible());
        }
    }

    lock() {
        this.numbers.forEach(number => number.animateIn());
        this.locked = true;
    }

    unlock() {
        this.numbers.forEach(number => number.animateOut());
        this.locked = false;
    }

    addPanel(item) {
        if (!this.panel) {
            this.panel = new Panel();
            this.add(this.panel);
        }

        this.panel.add(item);
    }

    open() {
        this.clearTween().tween({ left: 48, opacity: 1 }, 400, 'easeOutCubic');

        if (this.locked) {
            this.numbers.forEach(number => number.animateIn(100));
        }

        if (this.panel) {
            this.panel.animateIn();
            this.panel.activate();
        }

        this.isOpen = true;
    }

    close(fast) {
        this.clearTween();

        if (fast) {
            this.css({ left: 10, opacity: 1 });

            if (this.panel) {
                this.panel.hide();
            }
        } else {
            this.tween({ left: 10, opacity: 1 }, 400, 'easeInCubic', 100);

            if (this.panel) {
                this.panel.animateOut();
                this.panel.deactivate();
            }
        }

        this.numbers.forEach(number => number.animateOut(fast));

        this.isOpen = false;
    }

    animateIn() {
        this.clearTween().css({ left: 10, opacity: 0 }).tween({ opacity: 1 }, 400, 'easeOutCubic', 200);
    }

    animateOut(fast, callback) {
        this.clearTween();

        if (fast) {
            this.tween({ opacity: 0 }, 300, 'easeOutSine', callback);
        } else {
            this.tween({ opacity: 0 }, 400, 'easeInCubic', 300, callback);
        }
    }
}
