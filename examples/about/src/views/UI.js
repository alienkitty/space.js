import { Interface, Stage } from '@alienkitty/space.js/three';

import { Header } from './ui/Header.js';

export class UI extends Interface {
    constructor() {
        super('.ui');

        this.invertColors = {
            light: Stage.rootStyle.getPropertyValue('--ui-invert-light-color').trim(),
            lightTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-triplet').trim(),
            dark: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color').trim(),
            darkTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-triplet').trim()
        };

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });
    }

    initViews() {
        this.header = new Header();
        this.add(this.header);
    }

    /**
     * Public methods
     */

    addPanel = item => {
        this.header.info.panel.add(item);
    };

    invert = isInverted => {
        Stage.root.style.setProperty('--ui-color', isInverted ? this.invertColors.light : this.invertColors.dark);
        Stage.root.style.setProperty('--ui-color-triplet', isInverted ? this.invertColors.lightTriplet : this.invertColors.darkTriplet);

        Stage.events.emit('invert', { invert: isInverted });
    };

    update = () => {
        this.header.info.update();
    };

    animateIn = () => {
        this.header.animateIn();
    };

    animateOut = () => {
        this.header.animateOut();
    };
}
