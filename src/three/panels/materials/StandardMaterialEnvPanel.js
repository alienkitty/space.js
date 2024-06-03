/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class StandardMaterialEnvPanel extends Panel {
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
            // TODO: Texture thumbnails
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 360,
                step: 0.3,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.x),
                callback: value => {
                    value = MathUtils.degToRad(value);
                    mesh.material.envMapRotation.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Rotate Y',
                min: 0,
                max: 360,
                step: 0.3,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.y),
                callback: value => {
                    value = MathUtils.degToRad(value);
                    mesh.material.envMapRotation.y = value;
                }
            },
            {
                type: 'slider',
                name: 'Rotate Z',
                min: 0,
                max: 360,
                step: 0.3,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.z),
                callback: value => {
                    value = MathUtils.degToRad(value);
                    mesh.material.envMapRotation.z = value;
                }
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 10,
                step: 0.1,
                value: mesh.material.envMapIntensity,
                callback: value => {
                    mesh.material.envMapIntensity = value;
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
