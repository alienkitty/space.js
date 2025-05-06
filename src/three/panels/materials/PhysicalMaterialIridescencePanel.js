/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialIridescencePanel extends Panel {
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
                value: mesh.material.iridescence,
                callback: value => {
                    mesh.material.iridescence = value;
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'iridescenceMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: mesh.material.iridescenceIOR,
                callback: value => {
                    mesh.material.iridescenceIOR = value;
                }
            },
            {
                type: 'slider',
                name: 'Thick Min',
                min: 0,
                max: 1400,
                step: 100,
                value: mesh.material.iridescenceThicknessRange[0],
                callback: value => {
                    mesh.material.iridescenceThicknessRange[0] = value;
                }
            },
            {
                type: 'slider',
                name: 'Thick Max',
                min: 0,
                max: 1400,
                step: 100,
                value: mesh.material.iridescenceThicknessRange[1],
                callback: value => {
                    mesh.material.iridescenceThicknessRange[1] = value;
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new MapPanel(mesh, 'iridescenceThicknessMap');
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
