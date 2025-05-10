/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { FlatShadingOptions, FogOptions, ToneMappedOptions, WireframeOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class PhongMaterialCommonPanel extends Panel {
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
                type: 'color',
                name: 'Emissive',
                value: material.emissive,
                callback: value => {
                    materials.forEach(material => material.emissive.copy(value));
                }
            },
            {
                type: 'color',
                name: 'Specular',
                value: material.specular,
                callback: value => {
                    materials.forEach(material => material.specular.copy(value));
                }
            },
            {
                type: 'slider',
                name: 'Shiny',
                min: 0,
                max: 100,
                step: 0.1,
                value: material.shininess,
                callback: value => {
                    materials.forEach(material => material.shininess = value);
                }
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
            },
            {
                type: 'list',
                name: 'Fog',
                list: FogOptions,
                value: getKeyByValue(FogOptions, material.fog),
                callback: value => {
                    materials.forEach(material => material.fog = FogOptions[value]);
                }
            },
            {
                type: 'list',
                name: 'Tone',
                list: ToneMappedOptions,
                value: getKeyByValue(ToneMappedOptions, material.toneMapped),
                callback: value => {
                    materials.forEach(material => material.toneMapped = ToneMappedOptions[value]);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
