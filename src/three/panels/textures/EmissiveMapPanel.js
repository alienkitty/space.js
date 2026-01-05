/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class EmissiveMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'emissiveMap');
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
                type: 'color',
                name: 'Emissive',
                value: material.emissive,
                callback: value => {
                    materials.forEach(material => material.emissive.copy(value));
                }
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.emissiveIntensity,
                callback: value => {
                    materials.forEach(material => material.emissiveIntensity = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
