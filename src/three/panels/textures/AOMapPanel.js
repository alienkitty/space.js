/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class AOMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'aoMap');
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
                name: 'Int',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.aoMapIntensity,
                callback: value => {
                    materials.forEach(material => material.aoMapIntensity = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
