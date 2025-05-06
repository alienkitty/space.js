/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class BumpMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'bumpMap');
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
                name: 'Scale',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.bumpScale,
                callback: value => {
                    mesh.material.bumpScale = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
