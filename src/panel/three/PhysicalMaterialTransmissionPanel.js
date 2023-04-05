/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

export class PhysicalMaterialTransmissionPanel extends Panel {
    constructor(material) {
        super();

        this.material = material;

        this.initPanel();
    }

    initPanel() {
        const material = this.material;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Intensity',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.transmission,
                callback: value => {
                    material.transmission = value;
                }
            },
            {
                type: 'slider',
                label: 'Thick',
                min: 0,
                max: 5,
                step: 0.01,
                value: material.thickness,
                callback: value => {
                    material.thickness = value;
                }
            },
            {
                type: 'color',
                value: material.attenuationColor,
                callback: value => {
                    material.attenuationColor.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Distance',
                min: 0,
                max: 5,
                step: 0.01,
                value: material.attenuationDistance,
                callback: value => {
                    material.attenuationDistance = value;
                }
            },
            {
                type: 'slider',
                label: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: material.ior,
                callback: value => {
                    material.ior = value;
                }
            },
            {
                type: 'slider',
                label: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.reflectivity,
                callback: value => {
                    material.reflectivity = value;
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
