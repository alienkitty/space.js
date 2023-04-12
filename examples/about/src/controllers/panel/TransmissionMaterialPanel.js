import { MeshHelperPanel, Panel, PanelItem, PhysicalMaterialClearcoatPanel, PhysicalMaterialCommonPanel, PhysicalMaterialEnvPanel, PhysicalMaterialSheenPanel } from '@alienkitty/space.js/three';

import { TransmissionMaterialTransmissionPanel } from './TransmissionMaterialTransmissionPanel.js';

export class TransmissionMaterialPanel extends Panel {
    static type = [
        'common',
        'standard',
        'physical'
    ];

    static properties = {
        common: [
            'emissive',
            'flatShading',
            'wireframe'
        ],
        standard: [
            'envMapIntensity'
        ],
        physical: [
            'specularColor',
            'specularIntensity',
            'ior',
            'reflectivity',
            'thickness',
            'attenuationColor',
            'attenuationDistance',
            'clearcoat',
            'clearcoatRoughness',
            'sheen',
            'sheenRoughness',
            'sheenColor'
        ],
        transmission: [
            'color',
            'roughness',
            'metalness',
            '_transmission',
            'chromaticAberration',
            'anisotropy'
        ]
    };

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        // Override defaults
        mesh.material._transmission = 1;

        const materialOptions = {
            Common: PhysicalMaterialCommonPanel,
            Clearcoat: PhysicalMaterialClearcoatPanel,
            Sheen: PhysicalMaterialSheenPanel,
            Transmission: TransmissionMaterialTransmissionPanel,
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
