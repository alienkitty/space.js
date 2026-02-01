import { MaterialPatches, Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

export class LambertMaterialAdjustmentsPanel extends Panel {
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
        if (mesh.userData.adjustments === undefined) {
            mesh.userData.adjustments = false;

            mesh.userData.adjustmentsUniforms = {
                hue: { value: 0 },
                saturation: { value: 0 },
                lightness: { value: 0 },
                brightness: { value: 0 },
                contrast: { value: 0 }
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

        const adjustmentsOptions = new Map([
            ['Off', false],
            ['On', true]
        ]);

        const adjustmentsItems = [
            {
                type: 'slider',
                name: 'Hue',
                min: -180,
                max: 180,
                step: 1,
                value: mesh.userData.adjustmentsUniforms.hue.value * 360,
                callback: value => {
                    mesh.userData.adjustmentsUniforms.hue.value = value / 360;
                }
            },
            {
                type: 'slider',
                name: 'Saturate',
                min: -100,
                max: 100,
                step: 1,
                value: mesh.userData.adjustmentsUniforms.saturation.value * 100,
                callback: value => {
                    mesh.userData.adjustmentsUniforms.saturation.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Light',
                min: -100,
                max: 100,
                step: 1,
                value: mesh.userData.adjustmentsUniforms.lightness.value * 100,
                callback: value => {
                    mesh.userData.adjustmentsUniforms.lightness.value = value / 100;
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
                value: mesh.userData.adjustmentsUniforms.brightness.value * 100,
                callback: value => {
                    mesh.userData.adjustmentsUniforms.brightness.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Contrast',
                min: -100,
                max: 100,
                step: 1,
                value: mesh.userData.adjustmentsUniforms.contrast.value * 100,
                callback: value => {
                    mesh.userData.adjustmentsUniforms.contrast.value = value / 100;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Adjustments',
                list: adjustmentsOptions,
                value: getKeyByValue(adjustmentsOptions, mesh.userData.adjustments),
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const adjustmentsPanel = new Panel();
                        adjustmentsPanel.animateIn(true);

                        adjustmentsItems.forEach(data => {
                            adjustmentsPanel.add(new PanelItem(data));
                        });

                        item.setContent(adjustmentsPanel);
                    }

                    mesh.userData.adjustments = adjustmentsOptions.get(value);

                    if (mesh.userData.adjustments) {
                        materials.forEach(material => material.userData.onBeforeCompile.adjustments = MaterialPatches.Lambert.adjustments);

                        item.toggleContent(true);
                    } else {
                        materials.forEach(material => delete material.userData.onBeforeCompile.adjustments);

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
