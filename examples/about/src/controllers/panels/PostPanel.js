import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';

export class PostPanel extends Panel {
    constructor() {
        super();

        this.initPanel();
    }

    initPanel() {
        const { drawBuffers, luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

        const postOptions = new Map([
            ['Off', false],
            ['On', true]
        ]);

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
                name: 'Interp',
                min: 0,
                max: 1,
                step: 0.01,
                value: drawBuffers.interpolateGeometry,
                callback: value => {
                    drawBuffers.interpolateGeometry = value;
                }
            },
            {
                type: 'slider',
                name: 'Smear',
                min: 0,
                max: 4,
                step: 0.02,
                value: drawBuffers.smearIntensity,
                callback: value => {
                    drawBuffers.smearIntensity = value;
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
                value: compositeMaterial.uniforms.uRGBAmount.value,
                callback: value => {
                    compositeMaterial.uniforms.uRGBAmount.value = value;
                }
            },
            {
                type: 'toggle',
                name: 'Dirt',
                value: compositeMaterial.uniforms.uLensDirt.value,
                callback: value => {
                    compositeMaterial.uniforms.uLensDirt.value = value;
                }
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

                    RenderManager.enabled = postOptions.get(value);

                    if (RenderManager.enabled) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
