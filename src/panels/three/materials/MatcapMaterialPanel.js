/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../../ui/three/Point3D.js';
import { Panel } from '../../Panel.js';
import { PanelItem } from '../../PanelItem.js';

import { MatcapMaterialCommonPanel } from './MatcapMaterialCommonPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MapPanel } from '../textures/MapPanel.js';

export const MatcapMaterialOptions = {
    Common: MatcapMaterialCommonPanel,
    Map: MapPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class MatcapMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'flatShading',
            'toneMapped'
        ]
    };

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete MatcapMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete MatcapMaterialOptions.Physics;
        }

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                label: 'Matcap',
                list: MatcapMaterialOptions,
                value: 'Common',
                callback: (value, panel) => {
                    const MaterialPanel = MatcapMaterialOptions[value];

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
