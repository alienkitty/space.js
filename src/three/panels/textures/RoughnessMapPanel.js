/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class RoughnessMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'roughnessMap');
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
                max: 2,
                step: 0.01,
                value: mesh.material.roughness,
                callback: value => {
                    mesh.material.roughness = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
