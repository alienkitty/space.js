import { Panel, PanelItem } from '@alienkitty/space.js/three';

import { WorldController } from '../world/WorldController.js';
import { RenderManager } from '../world/RenderManager.js';

import { isDebug, params } from '../../config/Config.js';

export class MarsPanel extends Panel {
    constructor(scene, lights, view) {
        super();

        this.scene = scene;
        this.lights = lights;
        this.view = view;

        this.initPanel();
    }

    initPanel() {
        const { vlMaterial } = RenderManager;

        const { mars } = this.view;

        const animateItems = [
            {
                type: 'slider',
                name: 'Speed',
                min: 0,
                max: 50,
                step: 0.1,
                value: params.speed,
                callback: value => {
                    params.speed = value;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'toggle',
                name: 'Red Tint',
                value: params.redTint,
                callback: value => {
                    params.redTint = value;

                    if (value) {
                        this.setPanelValue('Hue', -2);
                        this.setPanelValue('Saturate', -6);
                        this.setPanelValue('Light', -3);
                        this.setPanelValue('Bright', 5);
                        this.setPanelValue('Contrast', 10);
                    } else {
                        this.setPanelValue('Hue', -1);
                        this.setPanelValue('Saturate', -10);
                        this.setPanelValue('Light', -3);
                        this.setPanelValue('Bright', 6);
                        this.setPanelValue('Contrast', 10);
                    }
                }
            },
            {
                type: 'toggle',
                name: 'Sun Glow',
                value: params.sunGlow,
                callback: value => {
                    params.sunGlow = value;

                    if (value) {
                        vlMaterial.uniforms.uPower.value = 0.8;
                        vlMaterial.uniforms.uAmount.value = 0.4;
                    } else {
                        vlMaterial.uniforms.uPower.value = 0.3;
                        vlMaterial.uniforms.uAmount.value = 0;
                    }
                }
            },
            {
                type: 'toggle',
                name: 'Lights',
                value: params.lights,
                callback: value => {
                    params.lights = value;

                    if (value) {
                        this.lights[0].intensity = 2.5;
                        this.lights[1].intensity = 2;
                    } else {
                        this.lights[0].intensity = 0;
                        this.lights[1].intensity = 3;
                    }
                }
            },
            {
                type: 'toggle',
                name: 'Stars',
                value: params.stars,
                callback: value => {
                    params.stars = value;

                    if (value) {
                        this.scene.backgroundIntensity = WorldController.backgroundIntensity;
                    } else {
                        this.scene.backgroundIntensity = 0;
                    }
                }
            },
            {
                type: 'toggle',
                name: 'Animate',
                value: params.animate,
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const animatePanel = new Panel();
                        animatePanel.animateIn(true);

                        animateItems.forEach(data => {
                            animatePanel.add(new PanelItem(data));
                        });

                        item.setContent(animatePanel);
                    }

                    params.animate = value;

                    if (value) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Hue',
                min: -180,
                max: 180,
                step: 1,
                value: mars.hue.value * 360,
                callback: value => {
                    mars.hue.value = value / 360;
                }
            },
            {
                type: 'slider',
                name: 'Saturate',
                min: -100,
                max: 100,
                step: 1,
                value: mars.saturation.value * 100,
                callback: value => {
                    mars.saturation.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Light',
                min: -100,
                max: 100,
                step: 1,
                value: mars.lightness.value * 100,
                callback: value => {
                    mars.lightness.value = value / 100;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Bright',
                min: -100,
                max: 100,
                step: 1,
                value: mars.brightness.value * 100,
                callback: value => {
                    mars.brightness.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Contrast',
                min: -100,
                max: 100,
                step: 1,
                value: mars.contrast.value * 100,
                callback: value => {
                    mars.contrast.value = value / 100;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Normal X',
                min: -10,
                max: 10,
                step: 0.1,
                value: mars.mesh.material[0].normalScale.x,
                callback: value => {
                    mars.mesh.material.forEach(material => material.normalScale.x = value);
                }
            },
            {
                type: 'slider',
                name: 'Normal Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: mars.mesh.material[0].normalScale.y,
                callback: value => {
                    mars.mesh.material.forEach(material => material.normalScale.y = value);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Light X',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.lights[1].position.x,
                callback: value => {
                    this.lights[1].position.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Light Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.lights[1].position.y,
                callback: value => {
                    this.lights[1].position.y = value;
                }
            },
            {
                type: 'slider',
                name: 'Light Z',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.lights[1].position.z,
                callback: value => {
                    this.lights[1].position.z = value;
                }
            },
            {
                type: 'spacer'
            },
            {
                type: 'link',
                value: 'Reset',
                callback: () => {
                    this.setPanelValue('Red Tint', false);
                    this.setPanelValue('Sun Glow', true);
                    this.setPanelValue('Lights', true);
                    this.setPanelValue('Stars', true);
                    this.setPanelValue('Animate', !isDebug);
                    this.setPanelValue('Speed', 0.5);
                    this.setPanelValue('Normal X', 2);
                    this.setPanelValue('Normal Y', -2);
                    this.setPanelValue('Light X', -3);
                    this.setPanelValue('Light Y', 1.5);
                    this.setPanelValue('Light Z', -1.5);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
