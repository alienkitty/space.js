/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';

import { NormalMaterialCommonPanel } from './NormalMaterialCommonPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';

export const NormalMaterialOptions = new Map([
    ['Common', NormalMaterialCommonPanel],
    ['Bump', BumpMapPanel],
    ['Normal', NormalMapPanel],
    ['Displace', DisplacementMapPanel],
    ['Helper', MeshHelperPanel],
    ['Physics', OimoPhysicsPanel]
]);

export class NormalMaterialPanel extends Panel {
    static type = 'Normal';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Normal
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
            NormalMaterialOptions.delete('Helper');
        }

        if (!ui || !ui.constructor.physics) {
            NormalMaterialOptions.delete('Physics');
        }

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Normal',
                list: NormalMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = NormalMaterialOptions.get(value);

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
