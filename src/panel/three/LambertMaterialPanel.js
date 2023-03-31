/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';
import { CombineOptions, FlatShadingOptions, WireframeOptions } from './MaterialPanelOptions.js';

import { getKeyByValue } from '../../utils/Utils.js';

export class LambertMaterialPanel extends Panel {
    static type = [
        'common'
    ];

    static properties = {
        common: [
            'color',
            'emissive',
            'flatShading',
            'wireframe',
            'combine',
            'reflectivity',
            'refractionRatio'
        ]
    };

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
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: CombineOptions,
                value: getKeyByValue(CombineOptions, material.combine),
                callback: value => {
                    material.combine = CombineOptions[value];
                    material.needsUpdate = true;
                }
            },
            {
                type: 'slider',
                label: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.reflectivity,
                callback: value => {
                    material.reflectivity = value;
                }
            },
            {
                type: 'slider',
                label: 'Refract',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.refractionRatio,
                callback: value => {
                    material.refractionRatio = value;
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
