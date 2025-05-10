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

        const materials = this.materials;
        const material = this.material;

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
                value: material.displacementScale,
                callback: value => {
                    materials.forEach(material => material.displacementScale = value);
                }
            },
            {
                type: 'slider',
                name: 'Bias',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.displacementBias,
                callback: value => {
                    materials.forEach(material => material.displacementBias = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
