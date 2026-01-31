import { PanelItem, Point3D } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';
import { ScenePanelController } from './ScenePanelController.js';

import { isDebug } from '../../config/Config.js';

export class PanelController {
    static init(renderer, scene, camera, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.ui = ui;

        this.initControllers();
        this.initPanel();
    }

    static initControllers() {
        Point3D.init(this.renderer, this.scene, this.camera, {
            container: this.ui,
            debug: isDebug
        });

        ScenePanelController.init(this.view);
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

        const items = [
            {
                name: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Distance',
                min: 0,
                max: 1,
                step: 0.01,
                value: compositeMaterial.uniforms.uBlurDist.value,
                callback: value => {
                    compositeMaterial.uniforms.uBlurDist.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Strength',
                min: 0,
                max: 10,
                step: 0.1,
                value: compositeMaterial.uniforms.uBlurAmount.value,
                callback: value => {
                    compositeMaterial.uniforms.uBlurAmount.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 10,
                step: 0.1,
                value: compositeMaterial.uniforms.uRGBAmount.value,
                callback: value => {
                    compositeMaterial.uniforms.uRGBAmount.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Thresh',
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
                name: 'Smooth',
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
                name: 'Strength',
                min: 0,
                max: 2,
                step: 0.01,
                value: RenderManager.bloomStrength,
                callback: value => {
                    RenderManager.bloomStrength = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.getBloomFactors();
                }
            },
            {
                type: 'slider',
                name: 'Radius',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.bloomRadius,
                callback: value => {
                    RenderManager.bloomRadius = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.getBloomFactors();
                }
            }
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }

    // Public methods

    static update = time => {
        if (!this.ui) {
            return;
        }

        Point3D.update(time);
    };
}
