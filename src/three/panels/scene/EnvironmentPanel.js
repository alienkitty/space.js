/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

// import { EnvironmentTextureLoader } from '../../loaders/EnvironmentTextureLoader.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { EnvironmentMapOptions } from '../Options.js';

import { SceneMapPanel } from '../textures/SceneMapPanel.js';

import { TwoPI, getKeyByValue } from '../../../utils/Utils.js';

export class EnvironmentPanel extends Panel {
    constructor(renderer, scene) {
        super();

        this.renderer = renderer;
        this.scene = scene;

        this.initPanel();
    }

    initPanel() {
        // const renderer = this.renderer;
        const scene = this.scene;

        // Defaults
        if (scene.userData.pmrem === undefined) {
            scene.userData.pmrem = false;
        }

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const scenePanel = new SceneMapPanel(scene, 'environment');
                    scenePanel.animateIn(true);

                    item.setContent(scenePanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Type',
                list: EnvironmentMapOptions,
                value: getKeyByValue(EnvironmentMapOptions, scene.userData.pmrem),
                callback: value => {
                    scene.userData.pmrem = EnvironmentMapOptions[value];

                    /* if (scene.userData.pmrem) {
                        const loader = new EnvironmentTextureLoader(renderer);
                        loader.load('assets/textures/env/jewelry_black_contrast.jpg', texture => {
                            scene.environment = texture;
                        });
                    } else {
                        scene.environment = texture;
                    } */
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 10,
                step: 0.1,
                value: scene.environmentIntensity,
                callback: value => {
                    scene.environmentIntensity = value;
                }
            },
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.environmentRotation.x + (scene.environmentRotation.x < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.environmentRotation.x = MathUtils.degToRad(value);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Y',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.environmentRotation.y + (scene.environmentRotation.y < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.environmentRotation.y = MathUtils.degToRad(value);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Z',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.environmentRotation.z + (scene.environmentRotation.z < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.environmentRotation.z = MathUtils.degToRad(value);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
