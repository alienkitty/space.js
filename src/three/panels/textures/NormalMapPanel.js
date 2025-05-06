/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from '../../../panels/PanelItem.js';
import { NormalMapOptions } from '../Options.js';

import { MapPanel } from './MapPanel.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class NormalMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'normalMap');
    }

    initPanel() {
        super.initPanel();

        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Type',
                list: NormalMapOptions,
                value: getKeyByValue(NormalMapOptions, mesh.material.normalMapType),
                callback: value => {
                    mesh.material.normalMapType = NormalMapOptions[value];
                    mesh.material.needsUpdate = true;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Scale X',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.normalScale.x,
                callback: value => {
                    mesh.material.normalScale.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Scale Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.material.normalScale.y,
                callback: value => {
                    mesh.material.normalScale.y = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
