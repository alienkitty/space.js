import { ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping, NoToneMapping, ReinhardToneMapping } from 'three';

import { PanelItem, Point3D, Stage, brightness, getKeyByValue } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';
import { ScenePanelController } from './ScenePanelController.js';

export class PanelController {
    static init(renderer, scene, camera, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.ui = ui;

        this.lastInvert = null;

        this.initControllers();
        this.initPanel();
        this.setInvert(this.scene.background);
    }

    static initControllers() {
        Point3D.init(this.scene, this.camera, {
            root: Stage,
            container: this.ui
        });

        ScenePanelController.init(this.view);
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial } = RenderManager;

        // https://threejs.org/examples/#webgl_tonemapping
        const toneMappingOptions = {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping
        };

        const postOptions = {
            Off: false,
            Post: true
        };

        const items = [
            {
                label: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: this.scene.background,
                callback: value => {
                    this.scene.background.copy(value);

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

                    this.scene.traverse(object => {
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
                list: postOptions,
                value: getKeyByValue(postOptions, RenderManager.enabled),
                callback: value => {
                    RenderManager.enabled = postOptions[value];
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Thresh',
                min: 0,
                max: 1,
                step: 0.01,
                value: luminosityMaterial.uniforms.uThreshold.value,
                callback: value => {
                    luminosityMaterial.uniforms.uThreshold.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Smooth',
                min: 0,
                max: 1,
                step: 0.01,
                value: luminosityMaterial.uniforms.uSmoothing.value,
                callback: value => {
                    luminosityMaterial.uniforms.uSmoothing.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Strength',
                min: 0,
                max: 2,
                step: 0.01,
                value: RenderManager.bloomStrength,
                callback: value => {
                    RenderManager.bloomStrength = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
                }
            },
            {
                type: 'slider',
                label: 'Radius',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.bloomRadius,
                callback: value => {
                    RenderManager.bloomRadius = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
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
        this.ui.update();
    };
}
