/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { FlatShadingOptions, WireframeOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class NormalMaterialCommonPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
        const materials = this.materials;
        const material = this.material;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Wire',
                list: WireframeOptions,
                value: getKeyByValue(WireframeOptions, material.wireframe),
                callback: value => {
                    materials.forEach(material => material.wireframe = WireframeOptions[value]);
                }
            },
            {
                type: 'list',
                name: 'Flat',
                list: FlatShadingOptions,
                value: getKeyByValue(FlatShadingOptions, material.flatShading),
                callback: value => {
                    materials.forEach(material => {
                        material.flatShading = FlatShadingOptions[value];
                        material.needsUpdate = true;
                    });
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
