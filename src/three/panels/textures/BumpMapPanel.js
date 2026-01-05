/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from './MapPanel.js';

export class BumpMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'bumpMap');
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
                min: -10,
                max: 10,
                step: 0.1,
                value: material.bumpScale,
                callback: value => {
                    materials.forEach(material => material.bumpScale = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
