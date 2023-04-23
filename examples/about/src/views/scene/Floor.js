import { Color, GridHelper, Group } from 'three';

export class Floor extends Group {
    constructor() {
        super();

        this.position.y = -0.86;

        this.initGrid();
    }

    initGrid() {
        this.gridHelper = new GridHelper(10, 1);
        this.add(this.gridHelper);
    }

    /**
     * Public methods
     */

    invert = isInverted => {
        const colorStyle = `rgb(${getComputedStyle(document.querySelector(':root')).getPropertyValue('--ui-color-triplet').trim()})`;
        const color = new Color(colorStyle);

        if (!isInverted) { // Dark colour is muted
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
