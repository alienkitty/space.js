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

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.uniforms = this.mesh.userData.subsurfaceUniforms;
        this.supported = false;
        this.initialized = false;

        this.setSupported(this.uniforms.thicknessMap.value);
        this.initPanel();
    }

    setSupported(texture) {
        this.supported = !!(texture && texture.isTexture && !texture.isRenderTargetTexture && !texture.isCubeTexture);
    }

    initPanel() {
        const materials = this.materials;
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
                    if (this.initialized) {
                        if (value) {
                            if (this.supported) {
                                uniforms.thicknessMap.value.dispose();
                                uniforms.thicknessMap.value = new Texture(value);
                            } else {
                                uniforms.thicknessMap.value = new Texture(value);
                            }

                            uniforms.thicknessMap.value.needsUpdate = true;
                            uniforms.thicknessUseMap.value = true;
                        } else if (this.supported) {
                            uniforms.thicknessMap.value.dispose();
                            uniforms.thicknessMap.value = null;
                            uniforms.thicknessUseMap.value = false;
                        }

                        materials.forEach(material => material.needsUpdate = true);

                        this.setSupported(uniforms.thicknessMap.value);

                        item.setData(this.supported ? uniforms.thicknessMap.value : {});
                    }

                    if (!this.initialized) {
                        this.initialized = true;
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
