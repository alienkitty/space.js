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
export const MaterialOptions = new Map([
    ['Basic', [MeshBasicMaterial, BasicMaterialPanel]],
    ['Lambert', [MeshLambertMaterial, LambertMaterialPanel]],
    ['Matcap', [MeshMatcapMaterial, MatcapMaterialPanel]],
    ['Phong', [MeshPhongMaterial, PhongMaterialPanel]],
    ['Toon', [MeshToonMaterial, ToonMaterialPanel]],
    ['Standard', [MeshStandardMaterial, StandardMaterialPanel]],
    ['Physical', [MeshPhysicalMaterial, PhysicalMaterialPanel]],
    ['Normal', [MeshNormalMaterial, NormalMaterialPanel]]
]);

export function getKeyByMaterial(materialOptions, material) {
    for (const [key, value] of materialOptions.entries()) {
        if (material instanceof value[0]) {
            return key;
        }
    }
}

export class MaterialPanelController {
    static init(mesh, ui, {
        materialOptions = MaterialOptions
    } = {}) {
        this.mesh = mesh;
        this.ui = ui;
        this.materialOptions = materialOptions;

        this.properties = [];
        this.lastPanel = null;

        this.initPanel();
    }

    static initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;
        const materialOptions = this.materialOptions;

        this.materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        this.material = this.materials[0];

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
                value: this.material.opacity,
                callback: value => {
                    this.materials.forEach(material => {
                        if (!material.transparent) {
                            material.transparent = true;
                            material.needsUpdate = true;
                        }

                        material.opacity = value;
                    });
                }
            },
            {
                type: 'list',
                name: 'Side',
                list: SideOptions,
                value: getKeyByValue(SideOptions, this.material.side),
                callback: value => {
                    this.materials.forEach(material => {
                        material.side = SideOptions.get(value);
                        material.needsUpdate = true;
                    });
                }
            },
            {
                type: 'list',
                name: 'Material',
                list: materialOptions,
                value: getKeyByMaterial(materialOptions, this.material),
                callback: (value, item) => {
                    const [Material, MaterialPanel] = materialOptions.get(value);

                    const currentPanel = this.lastPanel || MaterialPanel;

                    const target = this.materials.map((material, i) => {
                        if (!this.properties[i]) {
                            this.properties[i] = {};
                        }

                        const properties = this.properties[i];

                        properties.transparent = material.transparent;
                        properties.opacity = material.opacity;
                        properties.side = material.side;

                        currentPanel.properties.forEach(key => {
                            if (key in material) {
                                const value = material[key];

                                if (value && (
                                    value.isVector2 ||
                                    value.isVector3 ||
                                    value.isVector4 ||
                                    value.isMatrix3 ||
                                    value.isMatrix4 ||
                                    value.isColor
                                )) {
                                    if (!properties[key]) {
                                        properties[key] = value.clone();
                                    } else {
                                        properties[key].copy(value);
                                    }
                                } else if (Array.isArray(value)) {
                                    properties[key] = Array.from(value);
                                } else {
                                    properties[key] = value;
                                }
                            }
                        });

                        const target = new Material();

                        target.transparent = properties.transparent;
                        target.opacity = properties.opacity;
                        target.side = properties.side;

                        MaterialPanel.properties.forEach(key => {
                            if (key in target && key in properties) {
                                const value = properties[key];

                                if (key === 'clippingPlanes' && Array.isArray(value)) {
                                    const length = value.length;
                                    const array = new Array(length);

                                    for (let i = 0; i < length; i++) {
                                        array[i] = value[i].clone();
                                    }

                                    target.clippingPlanes = array;
                                } else if (key === 'userData') {
                                    target.userData = value;
                                    target.userData.onBeforeCompile = {};

                                    target.onBeforeCompile = shader => {
                                        for (const key in target.userData.onBeforeCompile) {
                                            target.userData.onBeforeCompile[key](shader, mesh);
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
                                    target[key].copy(value);
                                } else {
                                    target[key] = value;
                                }
                            }
                        });

                        if (MaterialPanel.type in MaterialPatches) {
                            for (const key in MaterialPatches[MaterialPanel.type]) {
                                target.userData.onBeforeCompile[key] = MaterialPatches[MaterialPanel.type][key];
                            }
                        }

                        if (ui.uvTexture) {
                            target.map = ui.uvTexture;
                        }

                        target.customProgramCacheKey = () => Object.keys(target.userData.onBeforeCompile).join('|');
                        target.needsUpdate = true;

                        return target;
                    });

                    mesh.material = Array.isArray(mesh.material) ? target : target[0];

                    this.materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    this.material = this.materials[0];

                    if (ui.point && ui.isDefault) {
                        ui.point.setData({
                            name: mesh.geometry.type,
                            type: this.material.type
                        });
                    }

                    const materialPanel = new MaterialPanel(mesh, ui);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);

                    this.lastPanel = MaterialPanel;
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

                    mesh.visible = VisibleOptions.get(value);

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
