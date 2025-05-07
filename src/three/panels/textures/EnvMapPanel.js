/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils, SRGBColorSpace } from 'three';

import { PanelItem } from '../../../panels/PanelItem.js';
import { CombineOptions } from '../Options.js';

import { MapPanel } from './MapPanel.js';

import { TwoPI, getKeyByValue } from '../../../utils/Utils.js';

export class EnvMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'envMap', SRGBColorSpace);
    }

    initPanel() {
        super.initPanel();

        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(mesh.material.envMapRotation.x + (mesh.material.envMapRotation.x < 0 ? TwoPI : 0)),
                callback: value => {
                    mesh.material.envMapRotation.x = MathUtils.degToRad(value);
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
                    mesh.material.envMapRotation.y = MathUtils.degToRad(value);
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
                    mesh.material.envMapRotation.z = MathUtils.degToRad(value);
                }
            }
        ];

        if (mesh.material.envMapIntensity !== undefined) {
            items.push(
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
            );
        }

        if (mesh.material.combine !== undefined) {
            items.push(
                {
                    type: 'divider'
                },
                {
                    type: 'list',
                    name: 'Combine',
                    list: CombineOptions,
                    value: getKeyByValue(CombineOptions, mesh.material.combine),
                    callback: value => {
                        mesh.material.combine = CombineOptions[value];
                        mesh.material.needsUpdate = true;
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
                {
                    type: 'slider',
                    name: 'Refract',
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: mesh.material.refractionRatio,
                    callback: value => {
                        mesh.material.refractionRatio = value;
                    }
                }
            );
        }

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
