/**
 * @author pschroen / https://ufo.ai/
 */

import {
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MeshToonMaterial
} from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { MaterialPatches } from '../Custom.js';
import { SideOptions, VisibleOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

import { BasicMaterialPanel } from './BasicMaterialPanel.js';
import { LambertMaterialPanel } from './LambertMaterialPanel.js';
import { MatcapMaterialPanel } from './MatcapMaterialPanel.js';
import { PhongMaterialPanel } from './PhongMaterialPanel.js';
import { ToonMaterialPanel } from './ToonMaterialPanel.js';
import { StandardMaterialPanel } from './StandardMaterialPanel.js';
import { PhysicalMaterialPanel } from './PhysicalMaterialPanel.js';
import { NormalMaterialPanel } from './NormalMaterialPanel.js';

// https://threejs.org/docs/scenes/material-browser.html
export const MaterialOptions = {
    Basic: [MeshBasicMaterial, BasicMaterialPanel],
    Lambert: [MeshLambertMaterial, LambertMaterialPanel],
    Matcap: [MeshMatcapMaterial, MatcapMaterialPanel],
    Phong: [MeshPhongMaterial, PhongMaterialPanel],
    Toon: [MeshToonMaterial, ToonMaterialPanel],
    Standard: [MeshStandardMaterial, StandardMaterialPanel],
    Physical: [MeshPhysicalMaterial, PhysicalMaterialPanel],
    Normal: [MeshNormalMaterial, NormalMaterialPanel]
};

export function getKeyByMaterial(materialOptions, material) {
    return Object.keys(materialOptions).reverse().find(key => material instanceof materialOptions[key][0]);
}

export class MaterialPanelController {
    static init(mesh, ui, {
        materialOptions = MaterialOptions
    } = {}) {
        this.mesh = mesh;
        this.ui = ui;
        this.materialOptions = materialOptions;

        this.lastMaterialPanel = null;

        this.initPanel();
    }

    static initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;
        const materialOptions = this.materialOptions;

        const materialProperties = {};

        const materialItems = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Opacity',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.opacity,
                callback: value => {
                    if (value < 1) {
                        mesh.material.transparent = true;
                        mesh.material.needsUpdate = true;
                    }

                    mesh.material.opacity = value;
                }
            },
            {
                type: 'list',
                name: 'Side',
                list: SideOptions,
                value: getKeyByValue(SideOptions, mesh.material.side),
                callback: value => {
                    mesh.material.side = SideOptions[value];
                    mesh.material.needsUpdate = true;
                }
            },
            {
                type: 'list',
                name: 'Material',
                list: materialOptions,
                value: getKeyByMaterial(materialOptions, mesh.material),
                callback: (value, item) => {
                    const [Material, MaterialPanel] = materialOptions[value];

                    const currentMaterialPanel = this.lastMaterialPanel || MaterialPanel;

                    materialProperties.transparent = mesh.material.transparent;
                    materialProperties.opacity = mesh.material.opacity;
                    materialProperties.side = mesh.material.side;

                    currentMaterialPanel.properties.forEach(key => {
                        if (key in mesh.material) {
                            const value = mesh.material[key];

                            if (value && (
                                value.isVector2 ||
                                value.isVector3 ||
                                value.isVector4 ||
                                value.isMatrix3 ||
                                value.isMatrix4 ||
                                value.isColor
                            )) {
                                if (!materialProperties[key]) {
                                    materialProperties[key] = value.clone();
                                } else {
                                    materialProperties[key].copy(value);
                                }
                            } else if (Array.isArray(value)) {
                                materialProperties[key] = Array.from(value);
                            } else {
                                materialProperties[key] = value;
                            }
                        }
                    });

                    materialProperties.map = mesh.material.map;

                    mesh.material = new Material();

                    mesh.material.transparent = materialProperties.transparent;
                    mesh.material.opacity = materialProperties.opacity;
                    mesh.material.side = materialProperties.side;

                    MaterialPanel.properties.forEach(key => {
                        if (key in mesh.material && key in materialProperties) {
                            const value = materialProperties[key];

                            if (key === 'clippingPlanes' && Array.isArray(value)) {
                                const length = value.length;
                                const array = new Array(length);

                                for (let i = 0; i < length; i++) {
                                    array[i] = value[i].clone();
                                }

                                mesh.material.clippingPlanes = array;
                            } else if (key === 'userData') {
                                mesh.material.userData = value;
                                mesh.material.userData.onBeforeCompile = {};

                                mesh.material.onBeforeCompile = shader => {
                                    for (const key in mesh.material.userData.onBeforeCompile) {
                                        mesh.material.userData.onBeforeCompile[key](shader, mesh);
                                    }
                                };
                            } else if (value && (
                                value.isVector2 ||
                                value.isVector3 ||
                                value.isVector4 ||
                                value.isMatrix3 ||
                                value.isMatrix4 ||
                                value.isColor
                            )) {
                                mesh.material[key].copy(value);
                            } else {
                                mesh.material[key] = value;
                            }
                        }
                    });

                    if (MaterialPanel.type in MaterialPatches) {
                        for (const key in MaterialPatches[MaterialPanel.type]) {
                            mesh.material.userData.onBeforeCompile[key] = MaterialPatches[MaterialPanel.type][key];
                        }
                    }

                    if (ui.uvTexture) {
                        mesh.material.map = ui.uvTexture;
                    } else {
                        mesh.material.map = materialProperties.map;
                    }

                    mesh.material.customProgramCacheKey = () => Object.keys(mesh.material.userData.onBeforeCompile).join('|');
                    mesh.material.needsUpdate = true;

                    if (ui.point && ui.isDefault) {
                        ui.point.setData({
                            name: mesh.geometry.type,
                            type: mesh.material.type
                        });
                    }

                    const materialPanel = new MaterialPanel(mesh);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);

                    this.lastMaterialPanel = MaterialPanel;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Visible',
                list: VisibleOptions,
                value: getKeyByValue(VisibleOptions, mesh.visible),
                callback: (value, item) => {
                    if (!item.hasContent()) {
                        const materialPanel = new Panel();
                        materialPanel.animateIn(true);

                        materialItems.forEach(data => {
                            materialPanel.add(new PanelItem(data));
                        });

                        item.setContent(materialPanel);
                    }

                    mesh.visible = VisibleOptions[value];

                    if (mesh.visible) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            }
        ];

        items.forEach(data => {
            ui.addPanel(new PanelItem(data));
        });
    }

    // Public methods

    static destroy() {
        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
