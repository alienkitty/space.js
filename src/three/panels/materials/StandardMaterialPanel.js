/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';
import { StandardMaterialPatches } from '../Patches.js';

import { StandardMaterialCommonPanel } from './StandardMaterialCommonPanel.js';
import { StandardMaterialAdjustmentsPanel } from './StandardMaterialAdjustmentsPanel.js';
import { StandardMaterialSubsurfacePanel } from './StandardMaterialSubsurfacePanel.js';
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
import { EnvMapPanel } from '../textures/EnvMapPanel.js';

export const StandardMaterialOptions = new Map([
    ['Common', StandardMaterialCommonPanel],
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
    ['Subsurface', StandardMaterialSubsurfacePanel],
    ['Adjust', StandardMaterialAdjustmentsPanel],
    ['Env', EnvMapPanel],
    ['Helper', MeshHelperPanel],
    ['Physics', OimoPhysicsPanel]
]);

export class StandardMaterialPanel extends Panel {
    static type = 'Standard';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Standard
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
            StandardMaterialOptions.delete('Helper');
        }

        if (!ui || !ui.constructor.physics) {
            StandardMaterialOptions.delete('Physics');
        }

        if (mesh.userData.adjustments) {
            materials.forEach(material => {
                material.userData.onBeforeCompile.adjustments = StandardMaterialPatches.adjustments;
                material.customProgramCacheKey = () => Object.keys(material.userData.onBeforeCompile).join('|');
                material.needsUpdate = true;
            });
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
                name: 'Standard',
                list: StandardMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = StandardMaterialOptions.get(value);

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
