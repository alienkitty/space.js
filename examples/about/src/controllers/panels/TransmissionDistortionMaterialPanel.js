import { Panel, PanelItem, PhysicalMaterialOptions } from '@alienkitty/space.js/three';

import { TransmissionDistortionMaterialFrontPanel } from './TransmissionDistortionMaterialFrontPanel.js';
import { TransmissionDistortionMaterialBackPanel } from './TransmissionDistortionMaterialBackPanel.js';

export class TransmissionDistortionMaterialPanel extends Panel {
    static type = [
        'common',
        'standard',
        'physical'
    ];

    static properties = {
        common: [
            'emissive',
            'flatShading',
            'wireframe',
            'toneMapped'
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
            'iridescence',
            'iridescenceIOR',
            'iridescenceThicknessRange',
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
            Common: PhysicalMaterialOptions.Common,
            Map: PhysicalMaterialOptions.Map,
            Clearcoat: PhysicalMaterialOptions.Clearcoat,
            Iridescence: PhysicalMaterialOptions.Iridescence,
            Sheen: PhysicalMaterialOptions.Sheen,
            Front: TransmissionDistortionMaterialFrontPanel,
            Back: TransmissionDistortionMaterialBackPanel,
            Env: PhysicalMaterialOptions.Env,
            Helper: PhysicalMaterialOptions.Helper
        };

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                label: 'Distortion',
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