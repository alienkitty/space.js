/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class PhysicalMaterialTransmissionPanel extends Panel {
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
                value: material.transmission,
                callback: value => {
                    materials.forEach(material => material.transmission = value);
                }
            },
            {
                type: 'slider',
                name: 'Thick',
                min: -10,
                max: 10,
                step: 0.1,
                value: material.thickness,
                callback: value => {
                    materials.forEach(material => material.thickness = value);
                }
            },
            {
                type: 'color',
                name: 'Attenuation Color',
                value: material.attenuationColor,
                callback: value => {
                    materials.forEach(material => material.attenuationColor.copy(value));
                }
            },
            {
                type: 'slider',
                name: 'Distance',
                min: -10,
                max: 10,
                step: 0.1,
                value: material.attenuationDistance,
                callback: value => {
                    materials.forEach(material => material.attenuationDistance = value);
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.dispersion,
                callback: value => {
                    materials.forEach(material => material.dispersion = value);
                }
            },
            {
                type: 'slider',
                name: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: material.ior,
                callback: value => {
                    materials.forEach(material => material.ior = value);
                }
            },
            {
                type: 'slider',
                name: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.reflectivity,
                callback: value => {
                    materials.forEach(material => material.reflectivity = value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
