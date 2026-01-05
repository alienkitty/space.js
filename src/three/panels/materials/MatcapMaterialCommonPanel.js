/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { FlatShadingOptions, FogOptions, ToneMappedOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MatcapMaterialCommonPanel extends Panel {
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
                type: 'color',
                name: 'Color',
                value: material.color,
                callback: value => {
                    materials.forEach(material => material.color.copy(value));
                }
            },
            {
                type: 'list',
                name: 'Flat',
                list: FlatShadingOptions,
                value: getKeyByValue(FlatShadingOptions, material.flatShading),
                callback: value => {
                    materials.forEach(material => {
                        material.flatShading = FlatShadingOptions.get(value);
                        material.needsUpdate = true;
                    });
                }
            },
            {
                type: 'list',
                name: 'Fog',
                list: FogOptions,
                value: getKeyByValue(FogOptions, material.fog),
                callback: value => {
                    materials.forEach(material => material.fog = FogOptions.get(value));
                }
            },
            {
                type: 'list',
                name: 'Tone',
                list: ToneMappedOptions,
                value: getKeyByValue(ToneMappedOptions, material.toneMapped),
                callback: value => {
                    materials.forEach(material => material.toneMapped = ToneMappedOptions.get(value));
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
