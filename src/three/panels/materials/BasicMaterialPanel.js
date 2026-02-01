/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Patches.js';

import { BasicMaterialCommonPanel } from './BasicMaterialCommonPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { SpecularMapPanel } from '../textures/SpecularMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';
import { EnvMapPanel } from '../textures/EnvMapPanel.js';

export const BasicMaterialOptions = new Map([
    ['Common', BasicMaterialCommonPanel],
    ['Map', TextureMapPanel],
    ['Light', LightMapPanel],
    ['AO', AOMapPanel],
    ['Specular', SpecularMapPanel],
    ['Alpha', AlphaMapPanel],
    ['Env', EnvMapPanel]
]);

export class BasicMaterialPanel extends Panel {
    static type = 'Basic';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Basic
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
                name: 'Basic',
                list: BasicMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = BasicMaterialOptions.get(value);

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
