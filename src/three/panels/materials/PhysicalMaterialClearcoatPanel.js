/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialClearcoatPanel extends Panel {
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
                value: mesh.material.clearcoat,
                callback: value => {
                    mesh.material.clearcoat = value;
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'clearcoatMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Rough',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.clearcoatRoughness,
                callback: value => {
                    mesh.material.clearcoatRoughness = value;
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'clearcoatRoughnessMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'clearcoatNormalMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'slider',
                name: 'Normal X',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.clearcoatNormalScale.x,
                callback: value => {
                    mesh.material.clearcoatNormalScale.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Normal Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.clearcoatNormalScale.y,
                callback: value => {
                    mesh.material.clearcoatNormalScale.y = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
