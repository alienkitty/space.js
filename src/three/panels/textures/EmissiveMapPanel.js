/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class EmissiveMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'emissiveMap');
    }

    initPanel() {
        super.initPanel();

        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                name: 'Emissive',
                value: mesh.material.emissive,
                callback: value => {
                    mesh.material.emissive.copy(value);
                }
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.emissiveIntensity,
                callback: value => {
                    mesh.material.emissiveIntensity = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
