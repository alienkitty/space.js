/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialProperties } from './MaterialProperties.js';
import { MaterialPanels } from '../Custom.js';

import { MatcapMaterialCommonPanel } from './MatcapMaterialCommonPanel.js';
import { MeshHelperPanel } from '../objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from '../physics/OimoPhysicsPanel.js';
import { MatcapMapPanel } from '../textures/MatcapMapPanel.js';
import { TextureMapPanel } from '../textures/TextureMapPanel.js';
import { BumpMapPanel } from '../textures/BumpMapPanel.js';
import { NormalMapPanel } from '../textures/NormalMapPanel.js';
import { DisplacementMapPanel } from '../textures/DisplacementMapPanel.js';
import { AlphaMapPanel } from '../textures/AlphaMapPanel.js';

export const MatcapMaterialOptions = {
    Common: MatcapMaterialCommonPanel,
    Matcap: MatcapMapPanel,
    Texture: TextureMapPanel,
    Bump: BumpMapPanel,
    Normal: NormalMapPanel,
    Displace: DisplacementMapPanel,
    Alpha: AlphaMapPanel,
    Helper: MeshHelperPanel,
    Physics: OimoPhysicsPanel
};

export class MatcapMaterialPanel extends Panel {
    static type = 'Matcap';

    static properties = [
        ...MaterialProperties.Common,
        ...MaterialProperties.Matcap
    ];

    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        if (!Point3D.points) {
            delete MatcapMaterialOptions.Helper;
        }

        if (!Point3D.physics) {
            delete MatcapMaterialOptions.Physics;
        }

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
                    const MaterialPanel = MatcapMaterialOptions[value];

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
