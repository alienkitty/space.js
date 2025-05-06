/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';

import { LambertMaterialCommonPanel } from './LambertMaterialCommonPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MapPanel } from '../textures/MapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { EmissiveMapPanel } from '../textures/EmissiveMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { SpecularMapPanel } from '../textures/SpecularMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';
import { EnvMapPanel } from '../textures/EnvMapPanel.js';

export const LambertMaterialOptions = {
    Common: LambertMaterialCommonPanel,
    Map: MapPanel,
    Light: LightMapPanel,
    AO: AOMapPanel,
    Emissive: EmissiveMapPanel,
    Bump: BumpMapPanel,
    Normal: NormalMapPanel,
    Displace: DisplacementMapPanel,
    Specular: SpecularMapPanel,
    Alpha: AlphaMapPanel,
    Env: EnvMapPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class LambertMaterialPanel extends Panel {
    static type = 'Lambert';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Lambert
    ];

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete LambertMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete LambertMaterialOptions.Physics;
        }

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Lambert',
                list: LambertMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = LambertMaterialOptions[value];

                    const materialPanel = new MaterialPanel(mesh);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            }
        ];

        const items = [];

        if (mesh.isInstancedMesh) {
            items.push(
                {
                    type: 'content',
                    callback: (value, item) => {
                        const { InstancedMeshPanel } = MaterialPanels;

                        const materialPanel = new InstancedMeshPanel(mesh, materialItems);
                        materialPanel.animateIn(true);

                        item.setContent(materialPanel);
                    }
                }
            );
        } else {
            items.push(...materialItems);
        }

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
