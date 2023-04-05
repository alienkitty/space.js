/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

export class PhysicalMaterialSheenPanel extends Panel {
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
                value: material.sheen,
                callback: value => {
                    material.sheen = value;
                }
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.sheenRoughness,
                callback: value => {
                    material.sheenRoughness = value;
                }
            },
            {
                type: 'color',
                value: material.sheenColor,
                callback: value => {
                    material.sheenColor.copy(value);
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
