import { Vector3 } from 'three';

import { DisplayOptions, LightOptions, LightPanelController, PanelItem, Point3D, Stage, brightness, getKeyByLight, getKeyByValue } from '@alienkitty/space.js/three';

import { WorldController } from '../world/WorldController.js';
import { PhysicsController } from '../world/PhysicsController.js';
import { RenderManager } from '../world/RenderManager.js';
import { ScenePanelController } from './ScenePanelController.js';
import { PostPanel } from './PostPanel.js';
import { EnvPanel } from './EnvPanel.js';
import { GridPanel } from './GridPanel.js';

import { params } from '../../config/Config.js';

export class PanelController {
    static init(renderer, scene, camera, physics, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.physics = physics;
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

        Point3D.init(this.renderer, this.scene, this.camera, {
            root: Stage,
            container: this.ui,
            physics: this.physics,
            loader: textureLoader,
            uvHelper: true
        });
        Point3D.enabled = false;

        ScenePanelController.init(this.view);
        LightPanelController.init(this.scene);
    }

    static initPanel() {
        const { motionBlur } = RenderManager;

        const scene = this.scene;
        const physics = this.physics;

        const vector3 = new Vector3();
        const gravity = physics.getGravity();

        const physicsOptions = {
            Off: false,
            Physics: true
        };

        const animateOptions = {
            Off: false,
            Animate: true
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

        sceneOptions.Grid = GridPanel;

        const items = [
            {
                name: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: DisplayOptions,
                value: getKeyByValue(DisplayOptions, RenderManager.display),
                callback: value => {
                    RenderManager.display = DisplayOptions[value];
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: physicsOptions,
                value: getKeyByValue(physicsOptions, PhysicsController.enabled),
                callback: value => {
                    PhysicsController.enabled = physicsOptions[value];

                    // Reset
                    vector3.set(0, 0, 0);

                    physics.objects.forEach(object => {
                        const { position, quaternion } = object;

                        physics.setPosition(object, position);
                        physics.setOrientation(object, quaternion);
                        physics.setLinearVelocity(object, vector3);
                        physics.setAngularVelocity(object, vector3);
                    });
                }
            },
            {
                type: 'slider',
                name: 'Gravity',
                min: -10,
                max: 10,
                step: 0.1,
                value: -gravity.y,
                callback: value => {
                    gravity.y = -value;
                    physics.setGravity(gravity);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: animateOptions,
                value: getKeyByValue(animateOptions, params.animate),
                callback: value => {
                    params.animate = animateOptions[value];
                    motionBlur.saveState = params.animate;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'color',
                // value: scene.background,
                value: RenderManager.currentBackground,
                callback: value => {
                    // scene.background.copy(value);
                    RenderManager.currentBackground.copy(value);

                    this.setInvert(value);
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
                    switch (value) {
                        case 'Post':
                        case 'Env': {
                            const ScenePanel = sceneOptions[value];

                            const scenePanel = new ScenePanel(scene);
                            scenePanel.animateIn(true);

                            panel.setContent(scenePanel);
                            break;
                        }
                        case 'Grid': {
                            const ScenePanel = sceneOptions[value];

                            const scenePanel = new ScenePanel(this.view.floor.gridHelper);
                            scenePanel.animateIn(true);

                            panel.setContent(scenePanel);
                            break;
                        }
                        default: {
                            const [light, LightPanel] = sceneOptions[value];

                            const lightPanel = new LightPanel(LightPanelController, light);
                            lightPanel.animateIn(true);

                            panel.setContent(lightPanel);
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

    // Public methods

    static setCamera = camera => {
        this.camera = camera;

        Point3D.setCamera(camera);
    };

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
    };

    static animateIn = () => {
        Point3D.enabled = true;
    };
}
