/**
 * @author pschroen / https://ufo.ai/
 */

// import { EnvironmentTextureLoader } from '../../loaders/EnvironmentTextureLoader.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { EnvironmentMapOptions } from '../Options.js';

import { SceneMapPanel } from '../textures/SceneMapPanel.js';

import { getKeyByValue } from '../../../utils/Utils.js';

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
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
