import { Color, GridHelper, Group } from 'three';

import { Stage } from '@alienkitty/space.js/three';

export class Floor extends Group {
    constructor() {
        super();

        this.position.y = -0.86;

        this.initGrid();

        this.addListeners();
    }

    initGrid() {
        this.gridHelper = new GridHelper(10, 1);
        this.add(this.gridHelper);
    }

    addListeners() {
        Stage.events.on('invert', this.onInvert);
    }

    /**
     * Event handlers
     */

    onInvert = ({ invert }) => {
        const colorStyle = `rgb(${getComputedStyle(document.querySelector(':root')).getPropertyValue('--ui-color-triplet').trim()})`;
        const color = new Color(colorStyle);

        if (!invert) { // Light colour is muted
            color.offsetHSL(0, 0, -0.35);
        }

        const array = color.toArray();

        const colors = this.gridHelper.geometry.getAttribute('color');

        for (let i = 0; i < colors.count; i++) {
            colors.setXYZ(i, ...array);
        }

        colors.needsUpdate = true;
    };
}
