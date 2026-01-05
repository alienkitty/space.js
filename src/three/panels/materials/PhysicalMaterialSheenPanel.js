/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class PhysicalMaterialSheenPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
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
                value: material.sheen,
                callback: value => {
                    materials.forEach(material => material.sheen = value);
                }
            },
            {
                type: 'color',
                name: 'Sheen Color',
                value: material.sheenColor,
                callback: value => {
                    materials.forEach(material => material.sheenColor.copy(value));
                }
            },
            {
                type: 'slider',
                name: 'Rough',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.sheenRoughness,
                callback: value => {
                    materials.forEach(material => material.sheenRoughness = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
