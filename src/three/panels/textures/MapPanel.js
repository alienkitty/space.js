/**
 * @author pschroen / https://ufo.ai/
 */

import { ColorManagement, SRGBColorSpace, Texture } from 'three';

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, WrapOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MapPanel extends Panel {
    constructor(mesh, key = 'map') {
        super();

        this.mesh = mesh;
        this.key = key;

        this.initPanel();
    }

    initPanel() {
        const { anisotropy } = Point3D;

        const mesh = this.mesh;
        const key = this.key;
        const point = Point3D.getPoint(mesh);

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                flipY: true,
                data: mesh.material[key] || {},
                value: mesh.material[key] && mesh.material[key].source.data,
                callback: (value, item) => {
                    const mapItems = [];

                    if (item.data.isTexture && item.data.userData.uv && !mesh.userData.uv) {
                        mesh.userData.uv = true;
                        point.toggleUVHelper(true);
                    }

                    if (point.uvTexture) {
                        if (value) {
                            if (mesh.material[key] && item.data.isTexture && !item.data.userData.uv) {
                                mesh.userData.uv = false;
                                point.toggleUVHelper(false);
                            }
                        } else if (mesh.material[key]) {
                            mesh.userData.uv = false;
                            point.toggleUVHelper(false);

                            if (mesh.material[key] && mesh.material[key].source.data) {
                                item.setData(mesh.material[key]);
                                item.setValue(mesh.material[key].source.data);
                                return;
                            }
                        }
                    } else if (value) {
                        if (mesh.material[key]) {
                            mesh.material[key].dispose();
                            mesh.material[key] = new Texture(value);
                            mesh.material[key].colorSpace = item.data.colorSpace;
                            mesh.material[key].anisotropy = item.data.anisotropy;
                            mesh.material[key].wrapS = item.data.wrapS;
                            mesh.material[key].wrapT = item.data.wrapT;
                            mesh.material[key].repeat.copy(item.data.repeat);
                        } else {
                            mesh.material[key] = new Texture(value);

                            if (ColorManagement.enabled) {
                                mesh.material[key].colorSpace = SRGBColorSpace;
                            }

                            mesh.material[key].anisotropy = anisotropy;
                        }

                        mesh.material[key].needsUpdate = true;
                        mesh.material.needsUpdate = true;
                    } else if (mesh.material[key]) {
                        mesh.material[key].dispose();
                        mesh.material[key] = null;
                        mesh.material.needsUpdate = true;
                    }

                    item.setData(mesh.material[key] || {});

                    if (mesh.material[key]) {
                        mapItems.push(
                            {
                                type: 'spacer'
                            },
                            {
                                type: 'list',
                                name: 'Color Space',
                                list: ColorSpaceOptions,
                                value: getKeyByValue(ColorSpaceOptions, mesh.material[key].colorSpace),
                                callback: value => {
                                    mesh.material[key].colorSpace = ColorSpaceOptions[value];
                                    mesh.material[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Anisotropy',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material[key].anisotropy,
                                callback: value => {
                                    mesh.material[key].anisotropy = value;
                                    mesh.material[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'list',
                                name: 'Wrap',
                                list: WrapOptions,
                                value: getKeyByValue(WrapOptions, mesh.material[key].wrapS),
                                callback: value => {
                                    const wrapping = WrapOptions[value];

                                    mesh.material[key].wrapS = wrapping;
                                    mesh.material[key].wrapT = wrapping;
                                    mesh.material[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'X',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material[key].repeat.x,
                                callback: value => {
                                    mesh.material[key].repeat.setX(value);
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Y',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material[key].repeat.y,
                                callback: value => {
                                    mesh.material[key].repeat.setY(value);
                                }
                            }
                        );
                    }

                    const mapPanel = new Panel();
                    mapPanel.animateIn(true);

                    mapItems.forEach(data => {
                        mapPanel.add(new PanelItem(data));
                    });

                    item.setContent(mapPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
