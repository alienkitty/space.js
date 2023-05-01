import { ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping, NoToneMapping, ReinhardToneMapping } from 'three';

import { LightOptions, LightPanelController, PanelItem, Point3D, Stage, brightness, getKeyByLight, getKeyByValue } from '@alienkitty/space.js/three';

import { WorldController } from '../world/WorldController.js';
import { ScenePanelController } from './ScenePanelController.js';
import { PostPanel } from './PostPanel.js';
import { EnvPanel } from './EnvPanel.js';

export class PanelController {
    static init(renderer, scene, camera, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.ui = ui;

        this.lastInvert = null;
        this.lights = [];

        this.initControllers();
        this.initPanel();
        this.setInvert(this.scene.background);
    }

    static initControllers() {
        const { textureLoader } = WorldController;

        Point3D.init(this.scene, this.camera, {
            root: Stage,
            container: this.ui,
            loader: textureLoader,
            uvHelper: true
        });
        Point3D.enabled = false;

        ScenePanelController.init(this.view);
        LightPanelController.init(this.scene);
    }

    static initPanel() {
        const scene = this.scene;

        // https://threejs.org/examples/#webgl_tonemapping
        const toneMappingOptions = {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping
        };

        const sceneOptions = {
            Post: PostPanel,
            Env: EnvPanel
        };

        scene.traverse(object => {
            if (object.isLight) {
                const key = getKeyByLight(LightOptions, object);

                sceneOptions[key] = [object, LightOptions[key][1]];

                this.lights.push(object);
            }
        });

        const items = [
            {
                label: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: scene.background,
                callback: value => {
                    scene.background.copy(value);

                    this.setInvert(value);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: toneMappingOptions,
                value: getKeyByValue(toneMappingOptions, this.renderer.toneMapping),
                callback: value => {
                    this.renderer.toneMapping = toneMappingOptions[value];

                    scene.traverse(object => {
                        if (object.isMesh) {
                            object.material.needsUpdate = true;
                        }
                    });
                }
            },
            {
                type: 'slider',
                label: 'Exp',
                min: 0,
                max: 2,
                step: 0.01,
                value: this.renderer.toneMappingExposure,
                callback: value => {
                    this.renderer.toneMappingExposure = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: sceneOptions,
                value: 'Post',
                callback: (value, panel) => {
                    if (value === 'Post' || value === 'Env') {
                        const ScenePanel = sceneOptions[value];

                        const scenePanel = new ScenePanel(scene);
                        scenePanel.animateIn(true);

                        panel.setContent(scenePanel);
                    } else {
                        const [light, LightPanel] = sceneOptions[value];

                        const lightPanel = new LightPanel(LightPanelController, light);
                        lightPanel.animateIn(true);

                        panel.setContent(lightPanel);
                    }
                }
            }
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }

    /**
     * Public methods
     */

    static setInvert = value => {
        const invert = brightness(value) > 0.6; // Light colour is inverted

        if (invert !== this.lastInvert) {
            this.lastInvert = invert;

            this.ui.invert(invert);
        }
    };

    static update = time => {
        if (!this.ui) {
            return;
        }

        Point3D.update(time);

        this.lights.forEach(light => {
            if (light.helper) {
                light.helper.update();
            }
        });

        this.ui.update();
    };

    static animateIn = () => {
        Point3D.enabled = true;
    };
}
