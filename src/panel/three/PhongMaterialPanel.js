/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';

import { PhongMaterialCommonPanel } from './PhongMaterialCommonPanel.js';
import { PhongMaterialEnvPanel } from './PhongMaterialEnvPanel.js';
import { MeshHelperPanel } from './MeshHelperPanel.js';
import { MapPanel } from './MapPanel.js';

export class PhongMaterialPanel extends Panel {
    static type = [
        'common',
        'phong'
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
        ],
        phong: [
            'specular',
            'shininess'
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
            Common: PhongMaterialCommonPanel,
            Map: MapPanel,
            Env: PhongMaterialEnvPanel,
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
