/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialAnisotropyPanel extends Panel {
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
                    const materialPanel = new MapPanel(mesh, 'anisotropyMap');
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
                max: 1,
                step: 0.01,
                value: material.anisotropy,
                callback: value => {
                    materials.forEach(material => material.anisotropy = value);
                }
            },
            {
                type: 'slider',
                name: 'Angle',
                min: 0,
                max: Math.PI / 2,
                step: 0.01,
                value: material.anisotropyRotation,
                callback: value => {
                    materials.forEach(material => material.anisotropyRotation = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
