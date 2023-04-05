/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';
import { FlatShadingOptions, WireframeOptions } from './MaterialPanelOptions.js';

import { getKeyByValue } from '../../utils/Utils.js';

export class StandardMaterialCommonPanel extends Panel {
    constructor(material) {
        super();

        this.material = material;

        this.initPanel();
    }

    initPanel() {
        const material = this.material;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: material.color,
                callback: value => {
                    material.color.copy(value);
                }
            },
            {
                type: 'color',
                value: material.emissive,
                callback: value => {
                    material.emissive.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.roughness,
                callback: value => {
                    material.roughness = value;
                }
            },
            {
                type: 'slider',
                label: 'Metal',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.metalness,
                callback: value => {
                    material.metalness = value;
                }
            },
            {
                type: 'list',
                list: FlatShadingOptions,
                value: getKeyByValue(FlatShadingOptions, material.flatShading),
                callback: value => {
                    material.flatShading = FlatShadingOptions[value];
                    material.needsUpdate = true;
                }
            },
            {
                type: 'list',
                list: WireframeOptions,
                value: getKeyByValue(WireframeOptions, material.wireframe),
                callback: value => {
                    material.wireframe = WireframeOptions[value];
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
