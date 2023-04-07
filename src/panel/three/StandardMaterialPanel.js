/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

import { StandardMaterialCommonPanel } from './StandardMaterialCommonPanel.js';
import { StandardMaterialEnvPanel } from './StandardMaterialEnvPanel.js';

export class StandardMaterialPanel extends Panel {
    static type = [
        'common',
        'standard'
    ];

    static properties = {
        common: [
            'color',
            'emissive',
            'flatShading',
            'wireframe'
        ],
        standard: [
            'roughness',
            'metalness',
            'envMapIntensity'
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
            Common: StandardMaterialCommonPanel,
            Env: StandardMaterialEnvPanel
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
