/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialSpecularColorPanel extends Panel {
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
                    const materialPanel = new MapPanel(mesh, ui, 'specularColorMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'color',
                name: 'Specular Color',
                value: material.specularColor,
                callback: value => {
                    materials.forEach(material => material.specularColor.copy(value));
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
