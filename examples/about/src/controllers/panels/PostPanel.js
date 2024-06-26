import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';

export class PostPanel extends Panel {
    constructor() {
        super();

        this.initPanel();
    }

    initPanel() {
        const { motionBlur, luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

        const postOptions = {
            Off: false,
            On: true
        };

        const dirtOptions = {
            Off: false,
            Dirt: true
        };

        const toneMappingOptions = {
            Off: false,
            Tone: true
        };

        const gammaOptions = {
            Off: false,
            Gamma: true
        };

        const postItems = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Interp',
                min: 0,
                max: 1,
                step: 0.01,
                value: motionBlur.interpolateGeometry,
                callback: value => {
                    motionBlur.interpolateGeometry = value;
                }
            },
            {
                type: 'slider',
                name: 'Smear',
                min: 0,
                max: 4,
                step: 0.02,
                value: motionBlur.smearIntensity,
                callback: value => {
                    motionBlur.smearIntensity = value;
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
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
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
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 10,
                step: 0.1,
                value: compositeMaterial.uniforms.uRGBStrength.value,
                callback: value => {
                    compositeMaterial.uniforms.uRGBStrength.value = value;
                }
            },
            {
                type: 'list',
                list: dirtOptions,
                value: getKeyByValue(dirtOptions, compositeMaterial.uniforms.uLensDirt.value),
                callback: value => {
                    compositeMaterial.uniforms.uLensDirt.value = dirtOptions[value];
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Tone',
                list: toneMappingOptions,
                value: getKeyByValue(toneMappingOptions, compositeMaterial.uniforms.uToneMapping.value),
                callback: value => {
                    compositeMaterial.uniforms.uToneMapping.value = toneMappingOptions[value];
                }
            },
            {
                type: 'slider',
                name: 'Exp',
                min: 0,
                max: 2,
                step: 0.01,
                value: compositeMaterial.uniforms.uExposure.value,
                callback: value => {
                    compositeMaterial.uniforms.uExposure.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Gamma',
                list: gammaOptions,
                value: getKeyByValue(gammaOptions, compositeMaterial.uniforms.uGamma.value),
                callback: value => {
                    compositeMaterial.uniforms.uGamma.value = gammaOptions[value];
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Post',
                list: postOptions,
                value: getKeyByValue(postOptions, RenderManager.enabled),
                callback: (value, panel) => {
                    if (!panel.group) {
                        const postPanel = new Panel();
                        postPanel.animateIn(true);

                        postItems.forEach(data => {
                            postPanel.add(new PanelItem(data));
                        });

                        panel.setContent(postPanel);
                    }

                    RenderManager.enabled = postOptions[value];

                    if (RenderManager.enabled) {
                        panel.toggleContent(true);
                    } else {
                        panel.toggleContent(false);
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
