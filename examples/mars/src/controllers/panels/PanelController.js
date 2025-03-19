import { LightOptions, LightPanelController, PanelItem, ScenePanel, getKeyByLight } from '@alienkitty/space.js/three';

import { MarsPanel } from './MarsPanel.js';
import { SunlightPanel } from './SunlightPanel.js';
import { PostPanel } from './PostPanel.js';

export class PanelController {
    static init(renderer, scene, camera, light, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.light = light;
        this.view = view;
        this.ui = ui;

        this.lights = [];

        this.initControllers();
        this.initPanel();
    }

    static initControllers() {
        LightPanelController.init(this.scene);
    }

    static initPanel() {
        const sceneOptions = {
            Mars: MarsPanel,
            Sunlight: SunlightPanel,
            // TODO: Fix CubeTexture backgroundBlurriness
            Space: ScenePanel,
            Post: PostPanel
        };

        this.scene.traverse(object => {
            if (object.isLight) {
                const key = getKeyByLight(LightOptions, object);

                sceneOptions[key] = [object, LightOptions[key][1]];

                this.lights.push(object);
            }
        });

        const items = [
            {
                name: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: sceneOptions,
                value: 'Mars',
                callback: (value, item) => {
                    switch (value) {
                        case 'Mars':
                        case 'Sunlight': {
                            const ScenePanel = sceneOptions[value];

                            const scenePanel = new ScenePanel(this.light, this.view);
                            scenePanel.animateIn(true);

                            item.setContent(scenePanel);
                            break;
                        }
                        case 'Space':
                        case 'Post': {
                            const ScenePanel = sceneOptions[value];

                            const scenePanel = new ScenePanel(this.scene, this.ui);
                            scenePanel.animateIn(true);

                            item.setContent(scenePanel);
                            break;
                        }
                        default: {
                            const [light, LightPanel] = sceneOptions[value];

                            const lightPanel = new LightPanel(LightPanelController, light);
                            lightPanel.animateIn(true);

                            item.setContent(lightPanel);
                            break;
                        }
                    }
                }
            }
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }
}
