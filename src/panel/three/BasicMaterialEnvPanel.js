/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';
import { CombineOptions } from './MaterialPanelOptions.js';

import { getKeyByValue } from '../../utils/Utils.js';

export class BasicMaterialEnvPanel extends Panel {
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
