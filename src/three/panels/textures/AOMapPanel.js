/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class AOMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'aoMap');
    }

    initPanel() {
        super.initPanel();

        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.aoMapIntensity,
                callback: value => {
                    mesh.material.aoMapIntensity = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
