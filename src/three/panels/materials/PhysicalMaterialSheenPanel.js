/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class PhysicalMaterialSheenPanel extends Panel {
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
                value: mesh.material.sheen,
                callback: value => {
                    mesh.material.sheen = value;
                }
            },
            {
                type: 'color',
                name: 'Sheen Color',
                value: mesh.material.sheenColor,
                callback: value => {
                    mesh.material.sheenColor.copy(value);
                }
            },
            {
                type: 'slider',
                name: 'Rough',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.sheenRoughness,
                callback: value => {
                    mesh.material.sheenRoughness = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
