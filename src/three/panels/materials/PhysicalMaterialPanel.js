/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';
import { StandardMaterialPatches } from '../Patches.js';

import { PhysicalMaterialCommonPanel } from './PhysicalMaterialCommonPanel.js';
import { PhysicalMaterialClearcoatPanel } from './PhysicalMaterialClearcoatPanel.js';
import { PhysicalMaterialIridescencePanel } from './PhysicalMaterialIridescencePanel.js';
import { PhysicalMaterialAnisotropyPanel } from './PhysicalMaterialAnisotropyPanel.js';
import { PhysicalMaterialSheenPanel } from './PhysicalMaterialSheenPanel.js';
import { PhysicalMaterialSubsurfacePanel } from './PhysicalMaterialSubsurfacePanel.js';
import { PhysicalMaterialTransmissionPanel } from './PhysicalMaterialTransmissionPanel.js';
import { PhysicalMaterialEnvPanel } from './PhysicalMaterialEnvPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MapPanel } from '../textures/MapPanel.js';

export const PhysicalMaterialOptions = {
    Common: PhysicalMaterialCommonPanel,
    Map: MapPanel,
    Clearcoat: PhysicalMaterialClearcoatPanel,
    Iridescence: PhysicalMaterialIridescencePanel,
    Anisotropy: PhysicalMaterialAnisotropyPanel,
    Sheen: PhysicalMaterialSheenPanel,
    Subsurface: PhysicalMaterialSubsurfacePanel,
    Transmission: PhysicalMaterialTransmissionPanel,
    Env: PhysicalMaterialEnvPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class PhysicalMaterialPanel extends Panel {
    static type = 'Physical';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Standard,
        ...MaterialProperties.Physical
    ];

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete PhysicalMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete PhysicalMaterialOptions.Physics;
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
                name: 'Physical',
                list: PhysicalMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = PhysicalMaterialOptions[value];

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
