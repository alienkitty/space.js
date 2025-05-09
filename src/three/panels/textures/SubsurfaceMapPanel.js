/**
 * @author pschroen / https://ufo.ai/
 */

import { Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

export class SubsurfaceMapPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.uniforms = this.mesh.userData.subsurfaceUniforms;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const uniforms = this.uniforms;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                flipY: true,
                data: uniforms.thicknessMap.value && uniforms.thicknessMap.value.isTexture && !uniforms.thicknessMap.value.isRenderTargetTexture ? uniforms.thicknessMap.value : {},
                value: uniforms.thicknessMap.value && uniforms.thicknessMap.value.isTexture && !uniforms.thicknessMap.value.isRenderTargetTexture && uniforms.thicknessMap.value.source.data,
                callback: (value, item) => {
                    if (value) {
                        if (uniforms.thicknessMap.value && uniforms.thicknessMap.value.isTexture && !uniforms.thicknessMap.value.isRenderTargetTexture) {
                            uniforms.thicknessMap.value.dispose();
                            uniforms.thicknessMap.value = new Texture(value);
                        } else {
                            uniforms.thicknessMap.value = new Texture(value);
                        }

                        uniforms.thicknessMap.value.needsUpdate = true;
                        uniforms.thicknessUseMap.value = true;
                        mesh.material.needsUpdate = true;
                    } else if (uniforms.thicknessMap.value && uniforms.thicknessMap.value.isTexture && !uniforms.thicknessMap.value.isRenderTargetTexture) {
                        uniforms.thicknessMap.value.dispose();
                        uniforms.thicknessMap.value = null;
                        uniforms.thicknessUseMap.value = false;
                        mesh.material.needsUpdate = true;
                    }

                    item.setData(uniforms.thicknessMap.value && uniforms.thicknessMap.value.isTexture && !uniforms.thicknessMap.value.isRenderTargetTexture ? uniforms.thicknessMap.value : {});
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
