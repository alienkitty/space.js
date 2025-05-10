/**
 * @author pschroen / https://ufo.ai/
 */

import { NoColorSpace, Texture, UVMapping } from 'three';

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, RefractionMappingOptions, WrapOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MapPanel extends Panel {
    constructor(mesh, key, mapping = UVMapping, colorSpace = NoColorSpace) {
        super();

        this.mesh = mesh;
        this.key = key;
        this.mapping = mapping;
        this.colorSpace = colorSpace;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];
        this.supported = false;
        this.initialized = false;

        this.setSupported(this.material[key]);
        this.initPanel();
    }

    setSupported(texture) {
        this.supported = !!(texture && texture.isTexture && !texture.isRenderTargetTexture && !texture.isCubeTexture);
    }

    initPanel() {
        const mesh = this.mesh;
        const key = this.key;

        const materials = this.materials;
        const material = this.material;

        let point;

        if (Point3D.points) {
            point = Point3D.getPoint(mesh);
        }

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                flipY: true,
                data: this.supported ? material[key] : {},
                value: this.supported ? material[key].source.data : null,
                callback: (value, item) => {
                    const mapItems = [];

                    if (this.initialized) {
                        if (item.data.isTexture && item.data.userData.uv && !mesh.userData.uv) {
                            mesh.userData.uv = true;

                            if (point) {
                                point.toggleUVHelper(true);
                            }
                        }

                        if (point && point.uvTexture) {
                            if (value) {
                                if (material[key] && item.data.isTexture && !item.data.userData.uv) {
                                    mesh.userData.uv = false;
                                    point.toggleUVHelper(false);
                                }
                            } else if (material[key]) {
                                mesh.userData.uv = false;
                                point.toggleUVHelper(false);

                                if (material[key] && material[key].source.data) {
                                    item.setData(material[key]);
                                    item.setValue(material[key].source.data);
                                    return;
                                }
                            }
                        } else if (value) {
                            if (this.supported) {
                                material[key].dispose();
                                material[key] = new Texture(value);
                                material[key].mapping = item.data.mapping;
                                material[key].colorSpace = item.data.colorSpace;
                                material[key].anisotropy = item.data.anisotropy;
                                material[key].wrapS = item.data.wrapS;
                                material[key].wrapT = item.data.wrapT;
                                material[key].repeat.copy(item.data.repeat);
                            } else {
                                material[key] = new Texture(value);
                                material[key].mapping = this.mapping;
                                material[key].colorSpace = this.colorSpace;
                                material[key].anisotropy = Point3D.anisotropy;
                            }

                            if (!value.complete) {
                                value.onload = () => {
                                    material[key].needsUpdate = true;

                                    value.onload = null;
                                };
                            }

                            material.needsUpdate = true;
                        } else if (this.supported) {
                            material[key].dispose();
                            material[key] = null;
                            material.needsUpdate = true;
                        }

                        this.setSupported(material[key]);

                        item.setData(this.supported ? material[key] : {});
                    }

                    if (this.supported && !(key === 'envMap' && material.isMeshStandardMaterial)) {
                        if (material[key].mapping !== UVMapping) {
                            mapItems.push(
                                {
                                    type: 'spacer'
                                },
                                {
                                    type: 'list',
                                    name: 'Mapping',
                                    list: RefractionMappingOptions,
                                    value: getKeyByValue(RefractionMappingOptions, material[key].mapping),
                                    callback: value => {
                                        if (this.initialized) {
                                            materials.forEach(material => {
                                                material[key].mapping = RefractionMappingOptions[value];
                                                material[key].needsUpdate = true;
                                                material.needsUpdate = true;
                                            });
                                        }
                                    }
                                }
                            );
                        } else {
                            mapItems.push(
                                {
                                    type: 'spacer'
                                },
                                {
                                    type: 'list',
                                    name: 'Color Space',
                                    list: ColorSpaceOptions,
                                    value: getKeyByValue(ColorSpaceOptions, material[key].colorSpace),
                                    callback: value => {
                                        if (this.initialized) {
                                            materials.forEach(material => {
                                                material[key].colorSpace = ColorSpaceOptions[value];
                                                material[key].needsUpdate = true;
                                            });
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'Anisotropy',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].anisotropy,
                                    callback: value => {
                                        if (this.initialized) {
                                            materials.forEach(material => {
                                                material[key].anisotropy = value;
                                                material[key].needsUpdate = true;
                                            });
                                        }
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'Wrap',
                                    list: WrapOptions,
                                    value: getKeyByValue(WrapOptions, material[key].wrapS),
                                    callback: value => {
                                        if (this.initialized) {
                                            const wrapping = WrapOptions[value];

                                            materials.forEach(material => {
                                                material[key].wrapS = wrapping;
                                                material[key].wrapT = wrapping;
                                                material[key].needsUpdate = true;
                                            });
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'U',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].repeat.x,
                                    callback: value => {
                                        if (this.initialized) {
                                            materials.forEach(material => material[key].repeat.setX(value));
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'V',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].repeat.y,
                                    callback: value => {
                                        if (this.initialized) {
                                            materials.forEach(material => material[key].repeat.setY(value));
                                        }
                                    }
                                }
                            );
                        }
                    }

                    const mapPanel = new Panel();
                    mapPanel.animateIn(true);

                    mapItems.forEach(data => {
                        mapPanel.add(new PanelItem(data));
                    });

                    item.setContent(mapPanel);

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
