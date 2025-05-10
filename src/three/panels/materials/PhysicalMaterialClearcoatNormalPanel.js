/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialClearcoatNormalPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const materials = this.materials;
        const material = this.material;

        const items = [
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'clearcoatNormalMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Normal X',
                min: -10,
                max: 10,
                step: 0.1,
                value: material.clearcoatNormalScale.x,
                callback: value => {
                    materials.forEach(material => material.clearcoatNormalScale.x = value);
                }
            },
            {
                type: 'slider',
                name: 'Normal Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: material.clearcoatNormalScale.y,
                callback: value => {
                    materials.forEach(material => material.clearcoatNormalScale.y = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
