import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';

export class PostPanel extends Panel {
    constructor() {
        super();

        this.initPanel();
    }

    initPanel() {
        const {
            hBloomMaterial,
            vBloomMaterial,
            sceneCompositeMaterial,
            luminosityMaterial,
            bloomCompositeMaterial,
            compositeMaterial
        } = RenderManager;

        const postOptions = {
            Off: false,
            On: true
        };

        const toneMappingItems = [
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
            }
        ];

        const postItems = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Bloom',
                min: 0,
                max: 10,
                step: 0.1,
                value: hBloomMaterial.uniforms.uBlurAmount.value,
                callback: value => {
                    hBloomMaterial.uniforms.uBlurAmount.value = value;
                    vBloomMaterial.uniforms.uBlurAmount.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Reduce',
                min: 0,
                max: 1,
                step: 0.01,
                value: sceneCompositeMaterial.uniforms.uBloomReduction.value,
                callback: value => {
                    sceneCompositeMaterial.uniforms.uBloomReduction.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Boost',
                min: 0,
                max: 10,
                step: 0.1,
                value: sceneCompositeMaterial.uniforms.uBloomBoost.value,
                callback: value => {
                    sceneCompositeMaterial.uniforms.uBloomBoost.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Clamp',
                min: 0,
                max: 1,
                step: 0.01,
                value: sceneCompositeMaterial.uniforms.uBloomClamp.value,
                callback: value => {
                    sceneCompositeMaterial.uniforms.uBloomClamp.value = value;
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
                type: 'divider'
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
                type: 'slider',
                name: 'V Reduce',
                min: 0,
                max: 2,
                step: 0.01,
                value: compositeMaterial.uniforms.uReduction.value,
                callback: value => {
                    compositeMaterial.uniforms.uReduction.value = value;
                }
            },
            {
                type: 'slider',
                name: 'V Boost',
                min: 0,
                max: 2,
                step: 0.01,
                value: compositeMaterial.uniforms.uBoost.value,
                callback: value => {
                    compositeMaterial.uniforms.uBoost.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'toggle',
                name: 'Tone',
                value: compositeMaterial.uniforms.uToneMapping.value,
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const toneMappingPanel = new Panel();
                        toneMappingPanel.animateIn(true);

                        toneMappingItems.forEach(data => {
                            toneMappingPanel.add(new PanelItem(data));
                        });

                        item.setContent(toneMappingPanel);
                    }

                    compositeMaterial.uniforms.uToneMapping.value = value;

                    if (value) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            },
            {
                type: 'toggle',
                name: 'Gamma',
                value: compositeMaterial.uniforms.uGamma.value,
                callback: value => {
                    compositeMaterial.uniforms.uGamma.value = value;
                }
            },
            {
                type: 'toggle',
                name: 'SMAA',
                value: RenderManager.smaa,
                callback: value => {
                    RenderManager.smaa = value;
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
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const postPanel = new Panel();
                        postPanel.animateIn(true);

                        postItems.forEach(data => {
                            postPanel.add(new PanelItem(data));
                        });

                        item.setContent(postPanel);
                    }

                    RenderManager.enabled = postOptions[value];

                    if (RenderManager.enabled) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            },
            {
                type: 'spacer'
            },
            {
                type: 'link',
                value: 'Reset',
                callback: () => {
                    this.setPanelValue('Bloom', RenderManager.bloomAmount);
                    this.setPanelValue('Reduce', RenderManager.bloomReduction);
                    this.setPanelValue('Boost', RenderManager.bloomBoost);
                    this.setPanelValue('Clamp', RenderManager.bloomClamp);
                    this.setPanelValue('Thresh', RenderManager.luminosityThreshold);
                    this.setPanelValue('Smooth', RenderManager.luminositySmoothing);
                    this.setPanelValue('Strength', 0.3);
                    this.setPanelValue('Radius', 0.2);
                    this.setPanelValue('Chroma', RenderManager.rgbAmount);
                    this.setPanelValue('V Reduce', RenderManager.reduction);
                    this.setPanelValue('V Boost', RenderManager.boost);
                    this.setPanelValue('Tone', RenderManager.toneMapping);
                    this.setPanelValue('Exp', RenderManager.toneMappingExposure);
                    this.setPanelValue('Gamma', RenderManager.gammaCorrection);
                    this.setPanelValue('SMAA', true);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
