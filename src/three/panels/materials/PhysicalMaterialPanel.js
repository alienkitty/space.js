/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';
import { StandardMaterialPatches } from '../Patches.js';

import { PhysicalMaterialCommonPanel } from './PhysicalMaterialCommonPanel.js';
import { PhysicalMaterialAnisotropyPanel } from './PhysicalMaterialAnisotropyPanel.js';
import { PhysicalMaterialClearcoatPanel } from './PhysicalMaterialClearcoatPanel.js';
import { PhysicalMaterialClearcoatRoughnessPanel } from './PhysicalMaterialClearcoatRoughnessPanel.js';
import { PhysicalMaterialClearcoatNormalPanel } from './PhysicalMaterialClearcoatNormalPanel.js';
import { PhysicalMaterialIridescencePanel } from './PhysicalMaterialIridescencePanel.js';
import { PhysicalMaterialIridescenceThicknessPanel } from './PhysicalMaterialIridescenceThicknessPanel.js';
import { PhysicalMaterialSheenPanel } from './PhysicalMaterialSheenPanel.js';
import { PhysicalMaterialSheenColorPanel } from './PhysicalMaterialSheenColorPanel.js';
import { PhysicalMaterialSheenRoughnessPanel } from './PhysicalMaterialSheenRoughnessPanel.js';
import { PhysicalMaterialTransmissionPanel } from './PhysicalMaterialTransmissionPanel.js';
import { PhysicalMaterialTransmissionIntensityPanel } from './PhysicalMaterialTransmissionIntensityPanel.js';
import { PhysicalMaterialTransmissionThicknessPanel } from './PhysicalMaterialTransmissionThicknessPanel.js';
import { PhysicalMaterialSpecularPanel } from './PhysicalMaterialSpecularPanel.js';
import { PhysicalMaterialSpecularColorPanel } from './PhysicalMaterialSpecularColorPanel.js';
import { PhysicalMaterialSpecularIntensityPanel } from './PhysicalMaterialSpecularIntensityPanel.js';
import { PhysicalMaterialSubsurfacePanel } from './PhysicalMaterialSubsurfacePanel.js';
import { PhysicalMaterialEnvPanel } from './PhysicalMaterialEnvPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { EmissiveMapPanel } from '../textures/EmissiveMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { RoughnessMapPanel } from '../textures/RoughnessMapPanel.js';
import { MetalnessMapPanel } from '../textures/MetalnessMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';

export const PhysicalMaterialOptions = new Map([
    ['Common', PhysicalMaterialCommonPanel],
    ['Map', TextureMapPanel],
    ['Light', LightMapPanel],
    ['AO', AOMapPanel],
    ['Emissive', EmissiveMapPanel],
    ['Bump', BumpMapPanel],
    ['Normal', NormalMapPanel],
    ['Displace', DisplacementMapPanel],
    ['Rough', RoughnessMapPanel],
    ['Metal', MetalnessMapPanel],
    ['Alpha', AlphaMapPanel],
    ['Anis', PhysicalMaterialAnisotropyPanel],
    ['Coat', PhysicalMaterialClearcoatPanel],
    ['Coat Rough', PhysicalMaterialClearcoatRoughnessPanel],
    ['Coat Normal', PhysicalMaterialClearcoatNormalPanel],
    ['Irid', PhysicalMaterialIridescencePanel],
    ['Irid Thick', PhysicalMaterialIridescenceThicknessPanel],
    ['Sheen', PhysicalMaterialSheenPanel],
    ['Sheen Color', PhysicalMaterialSheenColorPanel],
    ['Sheen Rough', PhysicalMaterialSheenRoughnessPanel],
    ['Trans', PhysicalMaterialTransmissionPanel],
    ['Trans Int', PhysicalMaterialTransmissionIntensityPanel],
    ['Trans Thick', PhysicalMaterialTransmissionThicknessPanel],
    ['Specular', PhysicalMaterialSpecularPanel],
    ['Specular Color', PhysicalMaterialSpecularColorPanel],
    ['Specular Int', PhysicalMaterialSpecularIntensityPanel],
    ['Subsurface', PhysicalMaterialSubsurfacePanel],
    ['Env', PhysicalMaterialEnvPanel],
    ['Helper', MeshHelperPanel],
    ['Physics', OimoPhysicsPanel]
]);

export class PhysicalMaterialPanel extends Panel {
    static type = 'Physical';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Standard,
        ...MaterialProperties.Physical
    ];

    constructor(mesh, ui) {
        super();

        this.mesh = mesh;
        this.ui = ui;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;

        const materials = this.materials;

        if (!ui || !ui.constructor.points) {
            PhysicalMaterialOptions.delete('Helper');
        }

        if (!ui || !ui.constructor.physics) {
            PhysicalMaterialOptions.delete('Physics');
        }

        if (mesh.userData.subsurface) {
            materials.forEach(material => {
                material.userData.onBeforeCompile.subsurface = StandardMaterialPatches.subsurface;
                material.customProgramCacheKey = () => Object.keys(material.userData.onBeforeCompile).join('|');
                material.needsUpdate = true;
            });
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
                    const MaterialPanel = PhysicalMaterialOptions.get(value);

                    const materialPanel = new MaterialPanel(mesh, ui);
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

                        const materialPanel = new InstancedMeshPanel(mesh, ui, materialItems);
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
