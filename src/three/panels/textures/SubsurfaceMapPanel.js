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
        this.supported = false;

        this.setSupported(this.uniforms.thicknessMap.value);
        this.initPanel();
    }

    setSupported(texture) {
        this.supported = !!(texture && texture.isTexture && !texture.isRenderTargetTexture && !texture.isCubeTexture);
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
                data: this.supported ? uniforms.thicknessMap.value : {},
                value: this.supported ? uniforms.thicknessMap.value.source.data : null,
                callback: (value, item) => {
                    if (value) {
                        if (this.supported) {
                            uniforms.thicknessMap.value.dispose();
                            uniforms.thicknessMap.value = new Texture(value);
                        } else {
                            uniforms.thicknessMap.value = new Texture(value);
                        }

                        uniforms.thicknessMap.value.needsUpdate = true;
                        uniforms.thicknessUseMap.value = true;
                        mesh.material.needsUpdate = true;
                    } else if (this.supported) {
                        uniforms.thicknessMap.value.dispose();
                        uniforms.thicknessMap.value = null;
                        uniforms.thicknessUseMap.value = false;
                        mesh.material.needsUpdate = true;
                    }

                    this.setSupported(uniforms.thicknessMap.value);

                    item.setData(this.supported ? uniforms.thicknessMap.value : {});
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
