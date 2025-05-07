/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';
import { PhongMaterialPatches } from '../Patches.js';

import { PhongMaterialCommonPanel } from './PhongMaterialCommonPanel.js';
import { PhongMaterialSubsurfacePanel } from './PhongMaterialSubsurfacePanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { EmissiveMapPanel } from '../textures/EmissiveMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { SpecularMapPanel } from '../textures/SpecularMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';
import { EnvMapPanel } from '../textures/EnvMapPanel.js';

export const PhongMaterialOptions = {
    Common: PhongMaterialCommonPanel,
    Texture: TextureMapPanel,
    Light: LightMapPanel,
    AO: AOMapPanel,
    Emissive: EmissiveMapPanel,
    Bump: BumpMapPanel,
    Normal: NormalMapPanel,
    Displace: DisplacementMapPanel,
    Specular: SpecularMapPanel,
    Alpha: AlphaMapPanel,
    Subsurface: PhongMaterialSubsurfacePanel,
    Env: EnvMapPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class PhongMaterialPanel extends Panel {
    static type = 'Phong';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Phong
    ];

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete PhongMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete PhongMaterialOptions.Physics;
        }

        if (mesh.userData.subsurface) {
            mesh.material.userData.onBeforeCompile.subsurface = PhongMaterialPatches.subsurface;

            mesh.material.customProgramCacheKey = () => Object.keys(mesh.material.userData.onBeforeCompile).join('|');
            mesh.material.needsUpdate = true;
        }

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Phong',
                list: PhongMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = PhongMaterialOptions[value];

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
