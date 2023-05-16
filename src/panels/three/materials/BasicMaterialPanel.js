/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../../ui/three/Point3D.js';
import { Panel } from '../../Panel.js';
import { PanelItem } from '../../PanelItem.js';

import { BasicMaterialCommonPanel } from './BasicMaterialCommonPanel.js';
import { BasicMaterialEnvPanel } from './BasicMaterialEnvPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MapPanel } from '../textures/MapPanel.js';

export const BasicMaterialOptions = {
    Common: BasicMaterialCommonPanel,
    Map: MapPanel,
    Env: BasicMaterialEnvPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class BasicMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'wireframe',
            'toneMapped',
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

        if (!Point3D.points) {
            delete BasicMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete BasicMaterialOptions.Physics;
        }

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                label: 'Basic',
                list: BasicMaterialOptions,
                value: 'Common',
                callback: (value, panel) => {
                    const MaterialPanel = BasicMaterialOptions[value];

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
