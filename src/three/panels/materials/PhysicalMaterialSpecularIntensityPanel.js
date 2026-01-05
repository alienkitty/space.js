/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialSpecularIntensityPanel extends Panel {
    constructor(mesh, ui) {
        super();

        this.mesh = mesh;
        this.ui = ui;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;

        const materials = this.materials;
        const material = this.material;

        const items = [
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, ui, 'specularIntensityMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 32,
                step: 0.1,
                value: material.specularIntensity,
                callback: value => {
                    materials.forEach(material => material.specularIntensity = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
