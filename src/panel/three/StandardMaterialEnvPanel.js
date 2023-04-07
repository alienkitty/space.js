/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

export class StandardMaterialEnvPanel extends Panel {
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
            // TODO: Texture thumbnails
            {
                type: 'slider',
                label: 'Intensity',
                min: 0,
                max: 10,
                step: 0.1,
                value: material.envMapIntensity,
                callback: value => {
                    material.envMapIntensity = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
