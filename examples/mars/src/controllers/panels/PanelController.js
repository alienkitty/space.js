import { LightOptions, LightPanelController, PanelItem, getKeyByLight } from '@alienkitty/space.js/three';

import { MarsPanel } from './MarsPanel.js';
import { SunlightPanel } from './SunlightPanel.js';
import { SpacePanel } from './SpacePanel.js';
import { PostPanel } from './PostPanel.js';

export class PanelController {
    static init(renderer, scene, camera, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
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
        const sceneOptions = new Map([
            ['Mars', MarsPanel],
            ['Sunlight', SunlightPanel],
            ['Space', SpacePanel],
            ['Post', PostPanel]
        ]);

        this.scene.traverse(object => {
            if (object.isLight) {
                const key = getKeyByLight(LightOptions, object);

                sceneOptions.set(key, [object, LightOptions.get(key)[1]]);

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
                        case 'Mars': {
                            const ScenePanel = sceneOptions.get(value);

                            const scenePanel = new ScenePanel(this.scene, this.lights, this.view);
                            scenePanel.animateIn(true);

                            item.setContent(scenePanel);
                            break;
                        }
                        case 'Sunlight': {
                            const ScenePanel = sceneOptions.get(value);

                            const scenePanel = new ScenePanel(this.view);
                            scenePanel.animateIn(true);

                            item.setContent(scenePanel);
                            break;
                        }
                        case 'Space':
                        case 'Post': {
                            const ScenePanel = sceneOptions.get(value);

                            const scenePanel = new ScenePanel(this.scene, this.ui);
                            scenePanel.animateIn(true);

                            item.setContent(scenePanel);
                            break;
                        }
                        default: {
                            const [light, LightPanel] = sceneOptions.get(value);

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
