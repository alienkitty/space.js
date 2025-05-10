/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialIridescenceThicknessPanel extends Panel {
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
                    const materialPanel = new MapPanel(mesh, 'iridescenceThicknessMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Thick Min',
                min: 0,
                max: 1400,
                step: 100,
                value: material.iridescenceThicknessRange[0],
                callback: value => {
                    materials.forEach(material => material.iridescenceThicknessRange[0] = value);
                }
            },
            {
                type: 'slider',
                name: 'Thick Max',
                min: 0,
                max: 1400,
                step: 100,
                value: material.iridescenceThicknessRange[1],
                callback: value => {
                    materials.forEach(material => material.iridescenceThicknessRange[1] = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
