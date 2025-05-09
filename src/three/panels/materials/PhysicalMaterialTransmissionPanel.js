/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class PhysicalMaterialTransmissionPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

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
                value: mesh.material.transmission,
                callback: value => {
                    mesh.material.transmission = value;
                }
            },
            {
                type: 'slider',
                name: 'Thick',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.thickness,
                callback: value => {
                    mesh.material.thickness = value;
                }
            },
            {
                type: 'color',
                name: 'Attenuation Color',
                value: mesh.material.attenuationColor,
                callback: value => {
                    mesh.material.attenuationColor.copy(value);
                }
            },
            {
                type: 'slider',
                name: 'Distance',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.attenuationDistance,
                callback: value => {
                    mesh.material.attenuationDistance = value;
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.dispersion,
                callback: value => {
                    mesh.material.dispersion = value;
                }
            },
            {
                type: 'slider',
                name: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: mesh.material.ior,
                callback: value => {
                    mesh.material.ior = value;
                }
            },
            {
                type: 'slider',
                name: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.reflectivity,
                callback: value => {
                    mesh.material.reflectivity = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
