/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

import { BasicMaterialCommonPanel } from './BasicMaterialCommonPanel.js';
import { BasicMaterialEnvPanel } from './BasicMaterialEnvPanel.js';

export class BasicMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'wireframe',
            'combine',
            'reflectivity',
            'refractionRatio'
        ]
    };

    constructor(material) {
        super();

        this.material = material;

        this.initPanel();
    }

    initPanel() {
        const material = this.material;

        const materialOptions = {
            Common: BasicMaterialCommonPanel,
            Env: BasicMaterialEnvPanel
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

                    const materialPanel = new MaterialPanel(material);
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
