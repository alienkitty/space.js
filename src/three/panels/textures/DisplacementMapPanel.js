/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class DisplacementMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'displacementMap');
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
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.displacementScale,
                callback: value => {
                    mesh.material.displacementScale = value;
                }
            },
            {
                type: 'slider',
                name: 'Bias',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.displacementBias,
                callback: value => {
                    mesh.material.displacementBias = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
