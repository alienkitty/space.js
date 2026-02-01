/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Patches.js';

import { ToonMaterialCommonPanel } from './ToonMaterialCommonPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { GradientMapPanel } from '../textures/GradientMapPanel.js';
import { LightMapPanel } from '../textures/LightMapPanel.js';
import { AOMapPanel } from '../textures/AOMapPanel.js';
import { EmissiveMapPanel } from '../textures/EmissiveMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';

export const ToonMaterialOptions = new Map([
    ['Common', ToonMaterialCommonPanel],
    ['Map', TextureMapPanel],
    ['Gradient', GradientMapPanel],
    ['Light', LightMapPanel],
    ['AO', AOMapPanel],
    ['Emissive', EmissiveMapPanel],
    ['Bump', BumpMapPanel],
    ['Normal', NormalMapPanel],
    ['Displace', DisplacementMapPanel],
    ['Alpha', AlphaMapPanel]
]);

export class ToonMaterialPanel extends Panel {
    static type = 'Toon';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Toon
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
                name: 'Toon',
                list: ToonMaterialOptions,
                value: 'Common',
                callback: (value, item) => {
                    const MaterialPanel = ToonMaterialOptions.get(value);

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
