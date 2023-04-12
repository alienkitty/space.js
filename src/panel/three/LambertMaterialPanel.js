/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

import { LambertMaterialCommonPanel } from './LambertMaterialCommonPanel.js';
import { LambertMaterialEnvPanel } from './LambertMaterialEnvPanel.js';
import { MeshHelperPanel } from './MeshHelperPanel.js';

export class LambertMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'emissive',
            'flatShading',
            'wireframe',
            'combine',
            'reflectivity',
            'refractionRatio'
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
            Common: LambertMaterialCommonPanel,
            Env: LambertMaterialEnvPanel,
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
