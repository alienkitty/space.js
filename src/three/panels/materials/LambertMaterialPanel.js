/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';

import { LambertMaterialCommonPanel } from './LambertMaterialCommonPanel.js';
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

export const LambertMaterialOptions = new Map([
    ['Common', LambertMaterialCommonPanel],
    ['Map', TextureMapPanel],
    ['Light', LightMapPanel],
    ['AO', AOMapPanel],
    ['Emissive', EmissiveMapPanel],
    ['Bump', BumpMapPanel],
    ['Normal', NormalMapPanel],
    ['Displace', DisplacementMapPanel],
    ['Specular', SpecularMapPanel],
    ['Alpha', AlphaMapPanel],
    ['Env', EnvMapPanel],
    ['Helper', MeshHelperPanel],
    ['Physics', OimoPhysicsPanel]
]);

export class LambertMaterialPanel extends Panel {
    static type = 'Lambert';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Lambert
    ];

    constructor(mesh, ui) {
        super();

        this.mesh = mesh;
        this.ui = ui;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;

        if (!ui || !ui.constructor.points) {
            LambertMaterialOptions.delete('Helper');
        }

        if (!ui || !ui.constructor.physics) {
            LambertMaterialOptions.delete('Physics');
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
                    const MaterialPanel = LambertMaterialOptions.get(value);

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
