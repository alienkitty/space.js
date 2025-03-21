import { Panel, PanelItem } from '@alienkitty/space.js/three';

import { RenderManager } from '../world/RenderManager.js';

import { colors } from '../../config/Config.js';

export class SunlightPanel extends Panel {
    constructor(view) {
        super();

        this.view = view;

        this.initPanel();
    }

    initPanel() {
        const { vlMaterial } = RenderManager;

        const { sun } = this.view;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                name: 'Color',
                value: sun.occMesh.material.color,
                callback: value => {
                    sun.occMesh.material.color.copy(value);
                    vlMaterial.uniforms.uLightColor.value.copy(value);
                }
            },
            {
                type: 'slider',
                name: 'Power',
                min: 0,
                max: 6,
                step: 0.01,
                value: vlMaterial.uniforms.uPower.value,
                callback: value => {
                    vlMaterial.uniforms.uPower.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Amount',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uAmount.value,
                callback: value => {
                    vlMaterial.uniforms.uAmount.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Scale X',
                min: -2,
                max: 2,
                step: 0.01,
                value: vlMaterial.uniforms.uScale.value.x,
                callback: value => {
                    vlMaterial.uniforms.uScale.value.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Scale Y',
                min: -2,
                max: 2,
                step: 0.01,
                value: vlMaterial.uniforms.uScale.value.y,
                callback: value => {
                    vlMaterial.uniforms.uScale.value.y = value;
                }
            },
            {
                type: 'slider',
                name: 'Swizzle',
                min: -2,
                max: 2,
                step: 0.01,
                value: vlMaterial.uniforms.uSwizzle.value,
                callback: value => {
                    vlMaterial.uniforms.uSwizzle.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Exp',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uExposure.value,
                callback: value => {
                    vlMaterial.uniforms.uExposure.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Decay',
                min: 0.6,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uDecay.value,
                callback: value => {
                    vlMaterial.uniforms.uDecay.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Density',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uDensity.value,
                callback: value => {
                    vlMaterial.uniforms.uDensity.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Weight',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uWeight.value,
                callback: value => {
                    vlMaterial.uniforms.uWeight.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Clamp',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uClamp.value,
                callback: value => {
                    vlMaterial.uniforms.uClamp.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'F Scale X',
                min: 0,
                max: 4,
                step: 0.02,
                value: vlMaterial.uniforms.uLensflareScale.value.x,
                callback: value => {
                    vlMaterial.uniforms.uLensflareScale.value.x = value;
                }
            },
            {
                type: 'slider',
                name: 'F Scale Y',
                min: 0,
                max: 4,
                step: 0.02,
                value: vlMaterial.uniforms.uLensflareScale.value.y,
                callback: value => {
                    vlMaterial.uniforms.uLensflareScale.value.y = value;
                }
            },
            {
                type: 'slider',
                name: 'F Exp',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uLensflareExposure.value,
                callback: value => {
                    vlMaterial.uniforms.uLensflareExposure.value = value;
                }
            },
            {
                type: 'slider',
                name: 'F Clamp',
                min: 0,
                max: 1,
                step: 0.01,
                value: vlMaterial.uniforms.uLensflareClamp.value,
                callback: value => {
                    vlMaterial.uniforms.uLensflareClamp.value = value;
                }
            },
            {
                type: 'spacer'
            },
            {
                type: 'link',
                value: 'Reset',
                callback: () => {
                    this.setPanelValue('Color', colors.lightColor);
                    this.setPanelValue('Power', RenderManager.glowPower);
                    this.setPanelValue('Amount', RenderManager.glowAmount);
                    this.setPanelValue('Scale X', RenderManager.vlScale.x);
                    this.setPanelValue('Scale Y', RenderManager.vlScale.y);
                    this.setPanelValue('Swizzle', RenderManager.vlSwizzle);
                    this.setPanelValue('Exp', RenderManager.vlExposure);
                    this.setPanelValue('Decay', RenderManager.vlDecay);
                    this.setPanelValue('Density', RenderManager.vlDensity);
                    this.setPanelValue('Weight', RenderManager.vlWeight);
                    this.setPanelValue('Clamp', RenderManager.vlClamp);
                    this.setPanelValue('F Scale X', RenderManager.lensflareScale.x);
                    this.setPanelValue('F Scale Y', RenderManager.lensflareScale.y);
                    this.setPanelValue('F Exp', RenderManager.lensflareExposure);
                    this.setPanelValue('F Clamp', RenderManager.lensflareClamp);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
