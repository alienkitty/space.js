/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../Panel.js';
import { PanelItem } from '../../PanelItem.js';
import { WireframeOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class BasicMaterialCommonPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                label: 'Color',
                value: mesh.material.color,
                callback: value => {
                    mesh.material.color.copy(value);
                }
            },
            {
                type: 'list',
                label: 'Wire',
                list: WireframeOptions,
                value: getKeyByValue(WireframeOptions, mesh.material.wireframe),
                callback: value => {
                    mesh.material.wireframe = WireframeOptions[value];
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
