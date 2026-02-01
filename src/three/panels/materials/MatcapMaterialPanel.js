/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Patches.js';

import { MatcapMaterialCommonPanel } from './MatcapMaterialCommonPanel.js';
import { MatcapMapPanel } from '../textures/MatcapMapPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';

export const MatcapMaterialOptions = new Map([
    ['Common', MatcapMaterialCommonPanel],
    ['Matcap', MatcapMapPanel],
    ['Map', TextureMapPanel],
    ['Bump', BumpMapPanel],
    ['Normal', NormalMapPanel],
    ['Displace', DisplacementMapPanel],
    ['Alpha', AlphaMapPanel]
]);

export class MatcapMaterialPanel extends Panel {
    static type = 'Matcap';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Matcap
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

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Matcap',
                list: MatcapMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = MatcapMaterialOptions.get(value);

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
