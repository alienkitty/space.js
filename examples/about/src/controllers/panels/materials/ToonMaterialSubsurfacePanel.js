import { MaterialPatches, Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

import { SubsurfaceMapPanel } from '../textures/SubsurfaceMapPanel.js';

export class ToonMaterialSubsurfacePanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const materials = this.materials;

        // Defaults
        if (mesh.userData.subsurface === undefined) {
            mesh.userData.subsurface = false;

            mesh.userData.subsurfaceUniforms = {
                thicknessMap: { value: null },
                thicknessUseMap: { value: false },
                thicknessDistortion: { value: 0.1 },
                thicknessAmbient: { value: 0 },
                thicknessAttenuation: { value: 0.5 },
                thicknessPower: { value: 2 },
                thicknessScale: { value: 10 }
            };
        }

        materials.forEach(material => {
            if (!material.userData.onBeforeCompile) {
                material.userData.onBeforeCompile = {};

                material.onBeforeCompile = shader => {
                    for (const key in material.userData.onBeforeCompile) {
                        material.userData.onBeforeCompile[key](shader, mesh);
                    }
                };
            }
        });

        const subsurfaceOptions = new Map([
            ['Off', false],
            ['On', true]
        ]);

        const subsurfaceItems = [
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new SubsurfaceMapPanel(mesh);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Distort',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.userData.subsurfaceUniforms.thicknessDistortion.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessDistortion.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Ambient',
                min: 0,
                max: 5,
                step: 0.01,
                value: mesh.userData.subsurfaceUniforms.thicknessAmbient.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessAmbient.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Atten',
                min: 0,
                max: 5,
                step: 0.01,
                value: mesh.userData.subsurfaceUniforms.thicknessAttenuation.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessAttenuation.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Power',
                min: 1,
                max: 32,
                step: 0.1,
                value: mesh.userData.subsurfaceUniforms.thicknessPower.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessPower.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Scale',
                min: 0,
                max: 64,
                step: 0.1,
                value: mesh.userData.subsurfaceUniforms.thicknessScale.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessScale.value = value;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Subsurface Scattering',
                list: subsurfaceOptions,
                value: getKeyByValue(subsurfaceOptions, mesh.userData.subsurface),
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const subsurfacePanel = new Panel();
                        subsurfacePanel.animateIn(true);

                        subsurfaceItems.forEach(data => {
                            subsurfacePanel.add(new PanelItem(data));
                        });

                        item.setContent(subsurfacePanel);
                    }

                    mesh.userData.subsurface = subsurfaceOptions.get(value);

                    if (mesh.userData.subsurface) {
                        materials.forEach(material => material.userData.onBeforeCompile.subsurface = MaterialPatches.Toon.subsurface);

                        item.toggleContent(true);
                    } else {
                        materials.forEach(material => delete material.userData.onBeforeCompile.subsurface);

                        item.toggleContent(false);
                    }

                    materials.forEach(material => {
                        material.customProgramCacheKey = () => Object.keys(material.userData.onBeforeCompile).join('|');
                        material.needsUpdate = true;
                    });
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
