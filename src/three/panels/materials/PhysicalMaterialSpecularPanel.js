/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class PhysicalMaterialSpecularPanel extends Panel {
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
                type: 'color',
                name: 'Specular Color',
                value: material.specularColor,
                callback: value => {
                    materials.forEach(material => material.specularColor.copy(value));
                }
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
