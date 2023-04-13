/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

import { MatcapMaterialCommonPanel } from './MatcapMaterialCommonPanel.js';
import { MeshHelperPanel } from './MeshHelperPanel.js';
import { MapPanel } from './MapPanel.js';

export class MatcapMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'flatShading'
        ]
    };

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const materialOptions = {
            Common: MatcapMaterialCommonPanel,
            Map: MapPanel,
            Helper: MeshHelperPanel
        };

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: materialOptions,
                value: 'Common',
                callback: (value, panel) => {
                    const MaterialPanel = materialOptions[value];

                    const materialPanel = new MaterialPanel(mesh);
                    materialPanel.animateIn(true);

                    panel.setContent(materialPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
