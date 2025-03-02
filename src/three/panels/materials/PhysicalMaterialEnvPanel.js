/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { TwoPI } from '../../../utils/Utils.js';

export class PhysicalMaterialEnvPanel extends Panel {
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
                type: 'slider',
                name: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: mesh.material.ior,
                callback: value => {
                    mesh.material.ior = value;
                }
            },
            {
                type: 'slider',
                name: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.reflectivity,
                callback: value => {
                    mesh.material.reflectivity = value;
                }
            },
            // TODO: Texture thumbnails
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.x + (mesh.material.envMapRotation.x < 0 ? TwoPI : 0)),
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
                step: 1,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.y + (mesh.material.envMapRotation.y < 0 ? TwoPI : 0)),
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
                step: 1,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.z + (mesh.material.envMapRotation.z < 0 ? TwoPI : 0)),
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
