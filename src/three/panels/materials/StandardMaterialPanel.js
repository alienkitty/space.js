/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';
import { StandardMaterialPatches } from '../Patches.js';

import { StandardMaterialCommonPanel } from './StandardMaterialCommonPanel.js';
import { StandardMaterialSubsurfacePanel } from './StandardMaterialSubsurfacePanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MapPanel } from '../textures/MapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { EmissiveMapPanel } from '../textures/EmissiveMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { RoughnessMapPanel } from '../textures/RoughnessMapPanel.js';
import { MetalnessMapPanel } from '../textures/MetalnessMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';
import { EnvMapPanel } from '../textures/EnvMapPanel.js';

export const StandardMaterialOptions = {
    Common: StandardMaterialCommonPanel,
    Map: MapPanel,
    Light: LightMapPanel,
    AO: AOMapPanel,
    Emissive: EmissiveMapPanel,
    Bump: BumpMapPanel,
    Normal: NormalMapPanel,
    Displace: DisplacementMapPanel,
    Rough: RoughnessMapPanel,
    Metal: MetalnessMapPanel,
    Alpha: AlphaMapPanel,
    Subsurface: StandardMaterialSubsurfacePanel,
    Env: EnvMapPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class StandardMaterialPanel extends Panel {
    static type = 'Standard';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Standard
    ];

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete StandardMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete StandardMaterialOptions.Physics;
        }

        if (mesh.userData.subsurface) {
            mesh.material.userData.onBeforeCompile.subsurface = StandardMaterialPatches.subsurface;

            mesh.material.customProgramCacheKey = () => Object.keys(mesh.material.userData.onBeforeCompile).join('|');
            mesh.material.needsUpdate = true;
        }

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Standard',
                list: StandardMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = StandardMaterialOptions[value];

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
