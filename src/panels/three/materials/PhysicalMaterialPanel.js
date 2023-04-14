/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../Panel.js';
import { PanelItem } from '../../PanelItem.js';

import { PhysicalMaterialCommonPanel } from './PhysicalMaterialCommonPanel.js';
import { PhysicalMaterialClearcoatPanel } from './PhysicalMaterialClearcoatPanel.js';
import { PhysicalMaterialSheenPanel } from './PhysicalMaterialSheenPanel.js';
import { PhysicalMaterialTransmissionPanel } from './PhysicalMaterialTransmissionPanel.js';
import { PhysicalMaterialEnvPanel } from './PhysicalMaterialEnvPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { MapPanel } from '../textures/MapPanel.js';

export class PhysicalMaterialPanel extends Panel {
    static type = [
        'common',
        'standard',
        'physical'
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
        ],
        physical: [
            'specularColor',
            'specularIntensity',
            'ior',
            'reflectivity',
            'transmission',
            'thickness',
            'attenuationColor',
            'attenuationDistance',
            'clearcoat',
            'clearcoatRoughness',
            'sheen',
            'sheenRoughness',
            'sheenColor'
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
            Common: PhysicalMaterialCommonPanel,
            Map: MapPanel,
            Clearcoat: PhysicalMaterialClearcoatPanel,
            Sheen: PhysicalMaterialSheenPanel,
            Transmission: PhysicalMaterialTransmissionPanel,
            Env: PhysicalMaterialEnvPanel,
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
